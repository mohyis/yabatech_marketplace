const router = require('express').Router();
const {payOrder, verifyPayment} = require('../controller/paymentController');
const { paymentRateLimiter } = require('../middleware/rateLimiter');

/**
 * @swagger
 * tags:
 *   name: Payment
 *   description: Payment processing via Korapay
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Payment:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Payment MongoDB ID
 *           example: 787674563782983746578439
 *         paymentId:
 *           type: string
 *           description: Generated payment invoice ID
 *           example: INV-Ab1C2d
 *         reference:
 *           type: string
 *           description: Unique payment reference used with Korapay
 *           example: aB3cD4eF5gH6
 *         adminId:
 *           type: string
 *           description: Admin linked to the payment
 *           example: 787674563782983746578439
 *         customerId:
 *           type: string
 *           description: Customer linked to the payment
 *           example: 787674563782983746578439
 *         orderId:
 *           type: string
 *           description: The associated order ID
 *           example: "#SC-1234567"
 *         item:
 *           type: string
 *           example: shirts
 *         specification:
 *           type: string
 *           example: dry clean only
 *         quantity:
 *           type: number
 *           example: 3
 *         amount:
 *           type: number
 *           example: 1500
 *         paymentMode:
 *           type: string
 *           example: online
 *         paymentDate:
 *           type: string
 *           format: date-time
 *           example: "2026-05-24T00:00:00.000Z"
 *         status:
 *           type: string
 *           enum: [pending, successful, refunded]
 *           example: pending
 */

/**
 * @swagger
 * /api/payment/payment/{id}:
 *   post:
 *     tags:
 *       - Payment
 *     summary: Initialize payment for an order
 *     description: Initializes a Korapay payment for the given order MongoDB ID and returns a checkout URL.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The Order MongoDB ID
 *         schema:
 *           type: string
 *           example: 787674563782983746578439
 *     responses:
 *       200:
 *         description: Payment initialized successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: payment initialized successfully
 *                 data:
 *                   type: object
 *                   description: Korapay checkout data
 *                   properties:
 *                     checkout_url:
 *                       type: string
 *                       example: https://pay.korapay.com/checkout/abc123
 *                     reference:
 *                       type: string
 *                       example: aB3cD4eF5gH6
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: order not found
 */
router.post('/payment/:id', paymentRateLimiter, payOrder)

/**
 * @swagger
 * /api/payment/verify-payment:
 *   get:
 *     tags:
 *       - Payment
 *     summary: Verify a payment
 *     description: Verifies the status of a Korapay payment using the payment reference. This endpoint is also the Korapay redirect URL after checkout.
 *     parameters:
 *       - in: query
 *         name: reference
 *         required: true
 *         description: The payment reference generated during initialization
 *         schema:
 *           type: string
 *           example: aB3cD4eF5gH6
 *     responses:
 *       200:
 *         description: Payment verification result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   enum:
 *                     - payment is still processing
 *                     - payment successful
 *                     - payment failed and refunded
 *                   example: payment successful
 *       404:
 *         description: Payment record not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: no payment found
 */
router.get('/verify-payment', verifyPayment)

module.exports = router;

