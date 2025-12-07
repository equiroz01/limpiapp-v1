import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
// AppError importado para uso futuro en manejo de errores personalizados
// import { AppError } from '../middleware/error.middleware';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

/**
 * Generate JWT tokens
 */
const generateTokens = (userId: string, email: string, userType: string) => {
  // expiresIn en segundos: 1h = 3600, 7d = 604800
  const accessExpiresIn = parseInt(process.env.JWT_EXPIRES_IN_SECONDS || '3600', 10);
  const refreshExpiresIn = parseInt(process.env.JWT_REFRESH_EXPIRES_IN_SECONDS || '604800', 10);

  const accessToken = jwt.sign(
    { userId, email, userType },
    process.env.JWT_SECRET as string,
    { expiresIn: accessExpiresIn }
  );

  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET as string,
    { expiresIn: refreshExpiresIn }
  );

  return { accessToken, refreshToken };
};

/**
 * POST /api/v1/auth/register
 * Register a new user (client or housekeeper)
 */
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Validate input
    await body('email').isEmail().run(req);
    await body('password').isLength({ min: 8 }).run(req);
    await body('firstName').notEmpty().run(req);
    await body('lastName').notEmpty().run(req);
    await body('userType').isIn(['CLIENT', 'HOUSEKEEPER']).run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
      return;
    }

    const { email, password, firstName, lastName, userType, phone } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      });
      return;
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
        userType,
        phone,
        status: 'PENDING_VERIFICATION'
      }
    });

    // Create profile based on user type
    if (userType === 'CLIENT') {
      await prisma.client.create({
        data: {
          userId: user.id
        }
      });
    } else if (userType === 'HOUSEKEEPER') {
      await prisma.housekeeper.create({
        data: {
          userId: user.id,
          hourlyRate: 0 // Will be set later during onboarding
        }
      });

      // Create verification record
      await prisma.verification.create({
        data: {
          housekeeperId: user.id
        }
      });
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user.id, user.email, user.userType);

    logger.info(`New user registered: ${user.email} (${userType})`);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          userType: user.userType,
          status: user.status
        },
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    logger.error('Registration error:', error);
    next(error);
  }
};

/**
 * POST /api/v1/auth/login
 * Login user
 */
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await body('email').isEmail().run(req);
    await body('password').notEmpty().run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
      return;
    }

    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        client: true,
        housekeeper: true
      }
    });

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
      return;
    }

    // Check if account is banned or suspended
    if (user.status === 'BANNED' || user.status === 'SUSPENDED') {
      res.status(403).json({
        success: false,
        message: `Account is ${user.status.toLowerCase()}`
      });
      return;
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
      return;
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    });

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user.id, user.email, user.userType);

    logger.info(`User logged in: ${user.email}`);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          userType: user.userType,
          status: user.status,
          emailVerified: user.emailVerified,
          phoneVerified: user.phoneVerified,
          profilePhoto: user.profilePhoto
        },
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    logger.error('Login error:', error);
    next(error);
  }
};

/**
 * POST /api/v1/auth/refresh-token
 * Refresh access token
 */
export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({
        success: false,
        message: 'Refresh token is required'
      });
      return;
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as {
      userId: string;
    };

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
      return;
    }

    // Generate new tokens
    const tokens = generateTokens(user.id, user.email, user.userType);

    res.json({
      success: true,
      data: tokens
    });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
      return;
    }
    next(error);
  }
};

/**
 * POST /api/v1/auth/verify-email
 * Verify email address
 */
export const verifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { token: _token } = req.body;

    // TODO: Implement email verification logic using _token
    // For now, just a placeholder

    res.json({
      success: true,
      message: 'Email verified successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/v1/auth/verify-phone/send-code
 * Send phone verification code
 */
export const sendPhoneCode = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { phone } = req.body;

    // TODO: Implement Twilio SMS sending
    // For now, just a placeholder
    logger.info(`Sending verification code to ${phone}`);

    res.json({
      success: true,
      message: 'Verification code sent'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/v1/auth/verify-phone/verify
 * Verify phone with code
 */
export const verifyPhone = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { phone: _phone, code: _code } = req.body;

    // TODO: Implement Twilio verification using _phone and _code
    // For now, just a placeholder

    res.json({
      success: true,
      message: 'Phone verified successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/v1/auth/forgot-password
 * Request password reset
 */
export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      // Don't reveal if user exists or not
      res.json({
        success: true,
        message: 'If the email exists, a reset link has been sent'
      });
      return;
    }

    // TODO: Generate reset token and send email
    logger.info(`Password reset requested for ${email}`);

    res.json({
      success: true,
      message: 'If the email exists, a reset link has been sent'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/v1/auth/reset-password
 * Reset password with token
 */
export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { token: _resetToken, newPassword: _newPassword } = req.body;

    // TODO: Verify _resetToken and update password using _newPassword

    res.json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    next(error);
  }
};
