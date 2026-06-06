import express from 'express';
const PaymentRouter = express.Router();
import { createCheckoutSession, verifyPayment } from '../controllers/PaymentController.js';
import { isAuthenticatedUser } from '../util/userAuth.js';

// إنشاء جلسة دفع Stripe
PaymentRouter.post('/payment/checkout', isAuthenticatedUser, createCheckoutSession);

// التحقق من نجاح الدفع
PaymentRouter.get('/payment/verify', isAuthenticatedUser, verifyPayment);

export default PaymentRouter;
