import { Router } from 'express';
import {
  register,
  login,
  refreshToken,
  verifyEmail,
  verifyPhone,
  sendPhoneCode,
  forgotPassword,
  resetPassword
} from '../controllers/auth.controller';
import { authRateLimiter } from '../middleware/rateLimiter.middleware';

const router = Router();

// POST /api/v1/auth/register
router.post('/register', authRateLimiter, register);

// POST /api/v1/auth/login
router.post('/login', authRateLimiter, login);

// POST /api/v1/auth/refresh-token
router.post('/refresh-token', refreshToken);

// POST /api/v1/auth/verify-email
router.post('/verify-email', verifyEmail);

// POST /api/v1/auth/verify-phone/send-code
router.post('/verify-phone/send-code', sendPhoneCode);

// POST /api/v1/auth/verify-phone/verify
router.post('/verify-phone/verify', verifyPhone);

// POST /api/v1/auth/forgot-password
router.post('/forgot-password', authRateLimiter, forgotPassword);

// POST /api/v1/auth/reset-password
router.post('/reset-password', resetPassword);

export default router;
