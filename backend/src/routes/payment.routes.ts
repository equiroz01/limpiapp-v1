import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import {
  addPaymentMethod,
  getPaymentMethods,
  deletePaymentMethod,
  processPayment
} from '../controllers/payment.controller';

const router = Router();

// All routes require authentication
router.use(authenticate);

// POST /api/v1/payments/methods
router.post('/methods', addPaymentMethod);

// GET /api/v1/payments/methods
router.get('/methods', getPaymentMethods);

// DELETE /api/v1/payments/methods/:id
router.delete('/methods/:id', deletePaymentMethod);

// POST /api/v1/payments/process
router.post('/process', processPayment);

export default router;
