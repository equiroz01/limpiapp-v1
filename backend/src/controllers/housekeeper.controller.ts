import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

/**
 * GET /api/v1/housekeepers/dashboard
 * Get housekeeper dashboard data
 */
export const getHousekeeperDashboard = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const housekeeperId = req.user!.id;

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const startOfPreviousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfPreviousMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const completedBookingsThisMonth = await prisma.booking.findMany({
      where: {
        housekeeperId,
        status: 'COMPLETED',
        completedAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    });

    const completedBookingsLastMonth = await prisma.booking.findMany({
        where: {
          housekeeperId,
          status: 'COMPLETED',
          completedAt: {
            gte: startOfPreviousMonth,
            lte: endOfPreviousMonth,
          },
        },
      });

    const currentMonthEarnings = completedBookingsThisMonth.reduce((acc, booking) => acc + parseFloat(booking.totalPrice.toString()), 0);
    const previousMonthEarnings = completedBookingsLastMonth.reduce((acc, booking) => acc + parseFloat(booking.totalPrice.toString()), 0);

    const earningsVsPreviousMonth = previousMonthEarnings > 0 
      ? ((currentMonthEarnings - previousMonthEarnings) / previousMonthEarnings) * 100 
      : currentMonthEarnings > 0 ? 100 : 0;

    const reviews = await prisma.review.findMany({
      where: {
        booking: {
          housekeeperId,
        },
        clientToHousekeeperRating: {
          not: null,
        },
      },
      select: {
        clientToHousekeeperRating: true,
      },
    });

    const averageRating = reviews.length > 0
      ? reviews.reduce((acc, review) => acc + review.clientToHousekeeperRating!, 0) / reviews.length
      : 0;

    const distinctClientsThisMonth = new Set(completedBookingsThisMonth.map(b => b.clientId));
    const repeatClients = await prisma.booking.count({
        where: {
            housekeeperId,
            clientId: {
                in: Array.from(distinctClientsThisMonth)
            },
            status: 'COMPLETED',
            completedAt: {
                lt: startOfMonth
            }
        }
    });

    const repeatClientRate = distinctClientsThisMonth.size > 0 ? (repeatClients / distinctClientsThisMonth.size) * 100 : 0;

    const housekeeper = await prisma.housekeeper.findUnique({
      where: { id: housekeeperId },
      select: { isAvailable: true },
    });

    res.json({
      success: true,
      data: {
        currentMonthEarnings,
        earningsVsPreviousMonth: Number(earningsVsPreviousMonth.toFixed(0)),
        completedBookingsMonth: completedBookingsThisMonth.length,
        averageRating: Number(averageRating.toFixed(1)),
        repeatClientRate: Number(repeatClientRate.toFixed(0)),
        isAvailable: housekeeper?.isAvailable || false,
      },
    });
  } catch (error) {
    logger.error('Get housekeeper dashboard error:', error);
    next(error);
  }
};


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

/**
 * POST /api/v1/housekeepers/verify
 * Submit verification data for a housekeeper
 */
export const submitVerificationData = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const housekeeper = await prisma.housekeeper.findUnique({ where: { userId: req.user!.id } });
    if (!housekeeper) {
      res.status(404).json({ success: false, message: 'Housekeeper profile not found.' });
      return;
    }
    const housekeeperId = housekeeper.id;
    
    const {
      identityStatus,
      documentType,
      documentNumber,
      documentCountry,
      documentExpiry,
      backgroundCheckStatus,
      backgroundCheckProvider,
      referencesData,
      interviewStatus,
      interviewNotes,
      interviewRating,
      verificationLevel
    } = req.body;

    const verification = await prisma.verification.upsert({
      where: { housekeeperId },
      update: {
        identityStatus,
        documentType,
        documentNumber,
        documentCountry,
        documentExpiry: documentExpiry ? new Date(documentExpiry) : undefined,
        backgroundCheckStatus,
        backgroundCheckProvider,
        referencesData,
        interviewStatus,
        interviewNotes,
        interviewRating,
        verificationLevel,
        needsReverification: true, // Mark for re-verification after new submission
      },
      create: {
        housekeeperId,
        identityStatus,
        documentType,
        documentNumber,
        documentCountry,
        documentExpiry: documentExpiry ? new Date(documentExpiry) : undefined,
        backgroundCheckStatus,
        backgroundCheckProvider,
        referencesData,
        interviewStatus,
        interviewNotes,
        interviewRating,
        verificationLevel,
      },
    });

    res.json({
      success: true,
      message: 'Verification data submitted successfully',
      data: verification
    });
  } catch (error) {
    logger.error('Submit verification data error:', error);
    next(error);
  }
};

/**
 * PUT /api/v1/housekeepers/:id/verify/status
 * Update verification status of a housekeeper (Admin only)
 */
export const updateVerificationStatus = async (
  req: AuthRequest, // Assuming Admin will also have an AuthRequest
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params; // Housekeeper ID
    const { status, field, notes } = req.body; // status: APPROVED/REJECTED/PENDING, field: 'identity', 'backgroundCheck', 'overall'

    // Implement authorization for ADMIN role here
    if (req.user?.userType !== 'ADMIN') {
      res.status(403).json({ success: false, message: 'Forbidden: Only administrators can update verification status' });
      return;
    }

    let dataToUpdate: any = {};
    if (field === 'identity') {
      dataToUpdate.identityStatus = status;
      if (status === 'APPROVED') dataToUpdate.identityVerifiedAt = new Date();
    } else if (field === 'backgroundCheck') {
      dataToUpdate.backgroundCheckStatus = status;
      if (status === 'APPROVED') dataToUpdate.backgroundCheckCompletedAt = new Date();
    } else if (field === 'overall') {
      dataToUpdate.verificationStatus = status;
      if (status === 'APPROVED') dataToUpdate.isVerified = true;
      else dataToUpdate.isVerified = false;
    } else {
      res.status(400).json({ success: false, message: 'Invalid verification field specified' });
      return;
    }

    const updatedVerification = await prisma.verification.update({
      where: { housekeeperId: id },
      data: dataToUpdate,
    });

    res.json({
      success: true,
      message: `Housekeeper verification ${field} status updated to ${status}`,
      data: updatedVerification
    });
  } catch (error) {
    logger.error('Update verification status error:', error);
    next(error);
  }
};

/**
 * PATCH /api/v1/housekeepers/availability
 * Update housekeeper availability
 */
export const updateAvailability = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { isAvailable } = req.body;
    
    if (typeof isAvailable !== 'boolean') {
      res.status(400).json({ success: false, message: 'isAvailable must be a boolean.' });
      return;
    }

    await prisma.housekeeper.update({
      where: { userId: req.user!.id },
      data: { isAvailable },
    });

    res.json({
      success: true,
      message: 'Availability updated successfully',
      data: { isAvailable },
    });
  } catch (error) {
    logger.error('Update availability error:', error);
    next(error);
  }
};