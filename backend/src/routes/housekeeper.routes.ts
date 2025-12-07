import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import {
  searchHousekeepers,
  getHousekeeperProfile,
  updateHousekeeperProfile,
  getHousekeeperReviews
} from '../controllers/housekeeper.controller';

const router = Router();

// Public routes
// GET /api/v1/housekeepers/search
router.get('/search', searchHousekeepers);

// GET /api/v1/housekeepers/:id
router.get('/:id', getHousekeeperProfile);

// GET /api/v1/housekeepers/:id/reviews
router.get('/:id/reviews', getHousekeeperReviews);

// Protected routes
router.put('/profile', authenticate, updateHousekeeperProfile);

export default router;
