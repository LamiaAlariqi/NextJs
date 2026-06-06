import express from 'express';
const PaymentRouter = express.Router();
import { createCheckoutSession, verifyPayment } from '../controllers/PaymentController.js';
import { isAuthenticatedUser } from '../util/userAuth.js';

PaymentRouter.post('/payment/checkout', isAuthenticatedUser, createCheckoutSession);
PaymentRouter.get('/payment/verify', isAuthenticatedUser, verifyPayment);

export default PaymentRouter;
