import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import {
  searchHousekeepers,
  getHousekeeperProfile,
  updateHousekeeperProfile,
  getHousekeeperReviews,
  submitVerificationData,
  updateVerificationStatus,
  getHousekeeperDashboard,
  updateAvailability,
} from '../controllers/housekeeper.controller';

const router = Router();

// Public routes
router.get('/search', searchHousekeepers);
router.get('/:id', getHousekeeperProfile);
router.get('/:id/reviews', getHousekeeperReviews);

// Protected routes for Housekeepers
router.get(
  '/dashboard',
  authenticate,
  authorize('HOUSEKEEPER'),
  getHousekeeperDashboard
);

router.put(
  '/profile',
  authenticate,
  authorize('HOUSEKEEPER'),
  updateHousekeeperProfile
);

router.patch(
  '/availability',
  authenticate,
  authorize('HOUSEKEEPER'),
  updateAvailability
);

router.post(
  '/verify',
  authenticate,
  authorize('HOUSEKEEPER'),
  submitVerificationData
);

// Protected route for Admins
router.put(
  '/:id/verify/status',
  authenticate,
  authorize('ADMIN'),
  updateVerificationStatus
);

export default router;
