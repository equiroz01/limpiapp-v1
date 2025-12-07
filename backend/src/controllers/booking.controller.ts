import { Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

/**
 * Generate unique booking code
 */
const generateBookingCode = (): string => {
  const prefix = 'LMP';
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${random}`;
};

/**
 * POST /api/v1/bookings
 * Create new booking
 */
export const createBooking = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      housekeeperId,
      addressId,
      scheduledDate,
      scheduledStartTime,
      estimatedDurationMinutes,
      servicesRequested,
      homeSize,
      hasPets,
      specialInstructions
    } = req.body;

    // Get client
    const client = await prisma.client.findUnique({
      where: { userId: req.user!.id }
    });

    if (!client) {
      res.status(404).json({
        success: false,
        message: 'Client profile not found'
      });
      return;
    }

    // Get housekeeper to calculate price
    const housekeeper = await prisma.housekeeper.findUnique({
      where: { id: housekeeperId }
    });

    if (!housekeeper) {
      res.status(404).json({
        success: false,
        message: 'Housekeeper not found'
      });
      return;
    }

    // Calculate pricing
    const hourlyRate = parseFloat(housekeeper.hourlyRate.toString());
    const hours = estimatedDurationMinutes / 60;
    const basePrice = hourlyRate * hours;
    const serviceFee = basePrice * 0.1; // 10% service fee
    const tax = basePrice * 0.16; // 16% IVA
    const totalPrice = basePrice + serviceFee + tax;

    // Calculate scheduled end time
    const startTime = new Date(scheduledStartTime);
    const endTime = new Date(startTime.getTime() + estimatedDurationMinutes * 60000);

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        bookingCode: generateBookingCode(),
        clientId: client.id,
        housekeeperId,
        addressId,
        scheduledDate: new Date(scheduledDate),
        scheduledStartTime: startTime,
        scheduledEndTime: endTime,
        estimatedDurationMinutes,
        servicesRequested,
        homeSize,
        hasPets,
        specialInstructions,
        basePrice,
        serviceFee,
        tax,
        subtotal: basePrice,
        totalPrice,
        status: 'PENDING'
      },
      include: {
        housekeeper: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                profilePhoto: true
              }
            }
          }
        },
        address: true
      }
    });

    // TODO: Send notification to housekeeper

    logger.info(`Booking created: ${booking.bookingCode}`);

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking
    });
  } catch (error) {
    logger.error('Create booking error:', error);
    next(error);
  }
};

/**
 * GET /api/v1/bookings
 * Get user's bookings
 */
export const getBookings = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    let whereClause: any = {};

    if (req.user!.userType === 'CLIENT') {
      const client = await prisma.client.findUnique({
        where: { userId: req.user!.id }
      });
      whereClause.clientId = client?.id;
    } else if (req.user!.userType === 'HOUSEKEEPER') {
      const housekeeper = await prisma.housekeeper.findUnique({
        where: { userId: req.user!.id }
      });
      whereClause.housekeeperId = housekeeper?.id;
    }

    if (status) {
      whereClause.status = status;
    }

    const bookings = await prisma.booking.findMany({
      where: whereClause,
      include: {
        client: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                profilePhoto: true
              }
            }
          }
        },
        housekeeper: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                profilePhoto: true
              }
            }
          }
        },
        address: true
      },
      orderBy: {
        scheduledDate: 'desc'
      },
      take: parseInt(limit as string),
      skip: (parseInt(page as string) - 1) * parseInt(limit as string)
    });

    res.json({
      success: true,
      data: bookings
    });
  } catch (error) {
    logger.error('Get bookings error:', error);
    next(error);
  }
};

/**
 * GET /api/v1/bookings/:id
 * Get booking by ID
 */
export const getBookingById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        client: {
          include: {
            user: true
          }
        },
        housekeeper: {
          include: {
            user: true
          }
        },
        address: true,
        payment: true,
        review: true
      }
    });

    if (!booking) {
      res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
      return;
    }

    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    logger.error('Get booking error:', error);
    next(error);
  }
};

/**
 * PUT /api/v1/bookings/:id/accept
 * Housekeeper accepts booking
 */
export const acceptBooking = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const booking = await prisma.booking.update({
      where: { id },
      data: {
        status: 'ACCEPTED',
        acceptedAt: new Date()
      }
    });

    // TODO: Send notification to client

    logger.info(`Booking accepted: ${booking.bookingCode}`);

    res.json({
      success: true,
      message: 'Booking accepted',
      data: booking
    });
  } catch (error) {
    logger.error('Accept booking error:', error);
    next(error);
  }
};

/**
 * PUT /api/v1/bookings/:id/reject
 * Housekeeper rejects booking
 */
export const rejectBooking = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const booking = await prisma.booking.update({
      where: { id },
      data: {
        status: 'REJECTED',
        cancellationReason: reason
      }
    });

    logger.info(`Booking rejected: ${booking.bookingCode}`);

    res.json({
      success: true,
      message: 'Booking rejected',
      data: booking
    });
  } catch (error) {
    logger.error('Reject booking error:', error);
    next(error);
  }
};

/**
 * DELETE /api/v1/bookings/:id
 * Cancel booking
 */
export const cancelBooking = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const booking = await prisma.booking.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        cancellationReason: reason,
        cancelledBy: req.user!.userType,
        cancelledAt: new Date()
      }
    });

    // TODO: Handle refund logic

    logger.info(`Booking cancelled: ${booking.bookingCode}`);

    res.json({
      success: true,
      message: 'Booking cancelled',
      data: booking
    });
  } catch (error) {
    logger.error('Cancel booking error:', error);
    next(error);
  }
};

/**
 * PUT /api/v1/bookings/:id/start
 * Start service
 */
export const startBooking = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const booking = await prisma.booking.update({
      where: { id },
      data: {
        status: 'IN_PROGRESS',
        actualStartTime: new Date()
      }
    });

    // TODO: Send notification to client

    logger.info(`Booking started: ${booking.bookingCode}`);

    res.json({
      success: true,
      message: 'Service started',
      data: booking
    });
  } catch (error) {
    logger.error('Start booking error:', error);
    next(error);
  }
};

/**
 * PUT /api/v1/bookings/:id/complete
 * Complete service
 */
export const completeBooking = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const booking = await prisma.booking.findUnique({
      where: { id }
    });

    if (!booking || !booking.actualStartTime) {
      res.status(400).json({
        success: false,
        message: 'Cannot complete booking that has not started'
      });
      return;
    }

    const endTime = new Date();
    const durationMinutes = Math.floor((endTime.getTime() - booking.actualStartTime.getTime()) / 60000);

    // Calculate extra time charge if applicable
    let extraTimePrice = 0;
    if (durationMinutes > booking.estimatedDurationMinutes) {
      const extraMinutes = durationMinutes - booking.estimatedDurationMinutes;
      const housekeeper = await prisma.housekeeper.findUnique({
        where: { id: booking.housekeeperId }
      });
      if (housekeeper) {
        const hourlyRate = parseFloat(housekeeper.hourlyRate.toString());
        extraTimePrice = (hourlyRate / 60) * extraMinutes;
      }
    }

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: {
        status: 'COMPLETED',
        actualEndTime: endTime,
        actualDurationMinutes: durationMinutes,
        extraTimePrice,
        totalPrice: {
          increment: extraTimePrice
        },
        completedAt: new Date()
      }
    });

    // TODO: Process payment
    // TODO: Send notification to client for rating

    logger.info(`Booking completed: ${booking.bookingCode}`);

    res.json({
      success: true,
      message: 'Service completed',
      data: updatedBooking
    });
  } catch (error) {
    logger.error('Complete booking error:', error);
    next(error);
  }
};
