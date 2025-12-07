import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import {
  getProfile,
  updateProfile,
  uploadProfilePhoto
} from '../controllers/user.controller';

const router = Router();

// All routes require authentication
router.use(authenticate);

// GET /api/v1/users/me
router.get('/me', getProfile);

// PUT /api/v1/users/me
router.put('/me', updateProfile);

// POST /api/v1/users/me/photo
router.post('/me/photo', uploadProfilePhoto);

export default router;
