import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import {
  createBooking,
  getBookings,
  getBookingById,
  acceptBooking,
  rejectBooking,
  cancelBooking,
  startBooking,
  completeBooking
} from '../controllers/booking.controller';

const router = Router();

// All routes require authentication
router.use(authenticate);

// POST /api/v1/bookings - Create new booking (client only)
router.post('/', authorize('CLIENT'), createBooking);

// GET /api/v1/bookings - List user's bookings
router.get('/', getBookings);

// GET /api/v1/bookings/:id - Get booking details
router.get('/:id', getBookingById);

// PUT /api/v1/bookings/:id/accept - Housekeeper accepts booking
router.put('/:id/accept', authorize('HOUSEKEEPER'), acceptBooking);

// PUT /api/v1/bookings/:id/reject - Housekeeper rejects booking
router.put('/:id/reject', authorize('HOUSEKEEPER'), rejectBooking);

// DELETE /api/v1/bookings/:id - Cancel booking
router.delete('/:id', cancelBooking);

// PUT /api/v1/bookings/:id/start - Start service
router.put('/:id/start', authorize('HOUSEKEEPER'), startBooking);

// PUT /api/v1/bookings/:id/complete - Complete service
router.put('/:id/complete', authorize('HOUSEKEEPER'), completeBooking);

export default router;
