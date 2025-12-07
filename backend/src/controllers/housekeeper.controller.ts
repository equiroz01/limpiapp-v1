import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

/**
 * GET /api/v1/housekeepers/search
 * Search for housekeepers
 */
export const searchHousekeepers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      lat,
      lng,
      radius = 10,
      services,
      minRating,
      maxPrice,
      page = 1,
      limit = 20
    } = req.query;

    // TODO: Implement geospatial search
    // For now, basic search
    const housekeepers = await prisma.housekeeper.findMany({
      where: {
        isVerified: true,
        isAvailable: true,
        verificationStatus: 'APPROVED'
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            profilePhoto: true
          }
        }
      },
      take: parseInt(limit as string),
      skip: (parseInt(page as string) - 1) * parseInt(limit as string)
    });

    res.json({
      success: true,
      data: housekeepers,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total: housekeepers.length
      }
    });
  } catch (error) {
    logger.error('Search housekeepers error:', error);
    next(error);
  }
};

/**
 * GET /api/v1/housekeepers/:id
 * Get housekeeper profile
 */
export const getHousekeeperProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const housekeeper = await prisma.housekeeper.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            profilePhoto: true
          }
        },
        verification: true
      }
    });

    if (!housekeeper) {
      res.status(404).json({
        success: false,
        message: 'Housekeeper not found'
      });
      return;
    }

    res.json({
      success: true,
      data: housekeeper
    });
  } catch (error) {
    logger.error('Get housekeeper profile error:', error);
    next(error);
  }
};

/**
 * PUT /api/v1/housekeepers/profile
 * Update housekeeper profile
 */
export const updateHousekeeperProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      bio,
      yearsExperience,
      hourlyRate,
      servicesOffered,
      hasOwnSupplies,
      coverageRadiusKm
    } = req.body;

    const housekeeper = await prisma.housekeeper.update({
      where: { userId: req.user!.id },
      data: {
        bio,
        yearsExperience,
        hourlyRate,
        servicesOffered,
        hasOwnSupplies,
        coverageRadiusKm
      }
    });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: housekeeper
    });
  } catch (error) {
    logger.error('Update housekeeper profile error:', error);
    next(error);
  }
};

/**
 * GET /api/v1/housekeepers/:id/reviews
 * Get housekeeper reviews
 */
export const getHousekeeperReviews = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const reviews = await prisma.review.findMany({
      where: {
        booking: {
          housekeeperId: id
        },
        clientToHousekeeperRating: {
          not: null
        }
      },
      include: {
        user: {
          select: {
            firstName: true,
            profilePhoto: true
          }
        },
        booking: {
          select: {
            completedAt: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: parseInt(limit as string),
      skip: (parseInt(page as string) - 1) * parseInt(limit as string)
    });

    res.json({
      success: true,
      data: reviews
    });
  } catch (error) {
    logger.error('Get reviews error:', error);
    next(error);
  }
};
