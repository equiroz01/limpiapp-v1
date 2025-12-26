import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import {
  createBooking,
  getClientBookings,
  getHousekeeperBookings,
  getBookingById,
  acceptBooking,
  // rejectBooking,
  // cancelBooking,
  updateBookingStatus,
  completeBooking
} from '../controllers/booking.controller';

const router = Router();

router.use(authenticate);

// Client-specific routes
router.post('/', authorize('CLIENT'), createBooking);
router.get('/client', authorize('CLIENT'), getClientBookings);

// Housekeeper-specific routes
router.get('/housekeeper', authorize('HOUSEKEEPER'), getHousekeeperBookings);
router.put('/:id/accept', authorize('HOUSEKEEPER'), acceptBooking);
// router.put('/:id/reject', authorize('HOUSEKEEPER'), rejectBooking);
router.post('/:id/complete', authorize('HOUSEKEEPER'), completeBooking);

// Common routes
router.get('/:id', getBookingById);
router.patch('/:id/status', updateBookingStatus);
// router.delete('/:id', cancelBooking);

export default router;
