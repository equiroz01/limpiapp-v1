import { Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

/**
 * GET /api/v1/users/me
 * Get current user profile
 */
export const getProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      include: {
        client: true,
        housekeeper: {
          include: {
            verification: true
          }
        },
        addresses: true
      }
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    // Remove sensitive data
    const { passwordHash, ...userWithoutPassword } = user;

    res.json({
      success: true,
      data: userWithoutPassword
    });
  } catch (error) {
    logger.error('Get profile error:', error);
    next(error);
  }
};

/**
 * PUT /api/v1/users/me
 * Update current user profile
 */
export const updateProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { firstName, lastName, phone, dateOfBirth, gender } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: req.user!.id },
      data: {
        firstName,
        lastName,
        phone,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
        gender
      }
    });

    const { passwordHash, ...userWithoutPassword } = updatedUser;

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: userWithoutPassword
    });
  } catch (error) {
    logger.error('Update profile error:', error);
    next(error);
  }
};

/**
 * POST /api/v1/users/me/photo
 * Upload profile photo
 */
export const uploadProfilePhoto = async (
  _req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // TODO: Implement file upload with multer and S3 using _req

    res.json({
      success: true,
      message: 'Photo uploaded successfully',
      data: {
        photoUrl: 'https://example.com/photo.jpg'
      }
    });
  } catch (error) {
    logger.error('Upload photo error:', error);
    next(error);
  }
};
