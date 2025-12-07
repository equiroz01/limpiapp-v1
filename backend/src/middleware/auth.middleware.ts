import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient, UserType } from '@prisma/client';

const prisma = new PrismaClient();

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    userType: UserType;
  };
}

/**
 * Middleware to authenticate JWT token
 */
export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'No token provided'
      });
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      email: string;
      userType: UserType;
    };

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        userType: true,
        status: true
      }
    });

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    if (user.status === 'BANNED' || user.status === 'SUSPENDED') {
      res.status(403).json({
        success: false,
        message: `Account is ${user.status.toLowerCase()}`
      });
      return;
    }

    // Attach user to request
    req.user = {
      id: user.id,
      email: user.email,
      userType: user.userType
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
      return;
    }

    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        success: false,
        message: 'Token expired'
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Authentication error'
    });
  }
};

/**
 * Middleware to authorize specific user types
 */
export const authorize = (...allowedTypes: UserType[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
      return;
    }

    if (!allowedTypes.includes(req.user.userType)) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to access this resource'
      });
      return;
    }

    next();
  };
};
