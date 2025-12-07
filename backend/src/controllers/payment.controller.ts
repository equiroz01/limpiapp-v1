import { Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

/**
 * POST /api/v1/payments/methods
 * Add payment method
 */
export const addPaymentMethod = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // TODO: Implement Stripe payment method creation

    res.json({
      success: true,
      message: 'Payment method added successfully'
    });
  } catch (error) {
    logger.error('Add payment method error:', error);
    next(error);
  }
};

/**
 * GET /api/v1/payments/methods
 * Get payment methods
 */
export const getPaymentMethods = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const client = await prisma.client.findUnique({
      where: { userId: req.user!.id },
      include: {
        paymentMethods: true
      }
    });

    res.json({
      success: true,
      data: client?.paymentMethods || []
    });
  } catch (error) {
    logger.error('Get payment methods error:', error);
    next(error);
  }
};

/**
 * DELETE /api/v1/payments/methods/:id
 * Delete payment method
 */
export const deletePaymentMethod = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    await prisma.paymentMethod.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Payment method deleted successfully'
    });
  } catch (error) {
    logger.error('Delete payment method error:', error);
    next(error);
  }
};

/**
 * POST /api/v1/payments/process
 * Process payment
 */
export const processPayment = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { bookingId, paymentMethodId } = req.body;

    // TODO: Implement Stripe payment processing

    res.json({
      success: true,
      message: 'Payment processed successfully'
    });
  } catch (error) {
    logger.error('Process payment error:', error);
    next(error);
  }
};
