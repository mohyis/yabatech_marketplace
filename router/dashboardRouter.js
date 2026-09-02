const router = require('express').Router();
const { dashboard } = require('../controller/dashboardController');
const { checkAdmin } = require('../middleware/validation');


/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 *   schemas:
 *     Order:
 *       type: object
 *       properties:
 *         orderId:
 *           type: string
 *           example: "SC7800736"
 *         amount:
 *           type: number
 *           example: 50000
 *         paymentMode:
 *           type: string
 *           example: "Card"
 *         bookingDate:
 *           type: string
 *           format: date-time
 *           example: "2026-03-10T08:00:00Z"
 *         deliveryDate:
 *           type: string
 *           format: date-time
 *           example: "2026-03-11T08:00:00Z"
 *         deliveryMode:
 *           type: string
 *           example: "Delivery"
 *         status:
 *           type: string
 *           enum: [in-progress, completed, new-request]
 *           example: "in-progress"
 *
 *     AdminData:
 *       type: object
 *       properties:
 *         adminName:
 *           type: string
 *           example: "John"
 *
 *     DashboardResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "welcome back John"
 *         data:
 *           $ref: '#/components/schemas/AdminData'
 *         totalOrders:
 *           type: integer
 *           example: 730
 *         totalRevenue:
 *           type: number
 *           example: 3567809
 *         inProgress:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Order'
 *         completed:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Order'
 *         latestOrder:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Order'
 */

/**
 * @swagger
 * /api/admin/dashboard:
 *   get:
 *     tags:
 *       - Dashboard
 *     summary: Get admin dashboard stats
 *     description: >
 *       Returns the admin's name, total orders, total revenue,
 *       in-progress orders, completed orders, and latest orders list.
 *       Requires admin authentication.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DashboardResponse'
 *             example:
 *               message: "welcome back John"
 *               data:
 *                 adminName: "John"
 *               totalOrders: 730
 *               totalRevenue: 3567809
 *               inProgress:
 *                 - orderId: "SC7800736"
 *                   amount: 50000
 *                   paymentMode: "Card"
 *                   bookingDate: "2026-03-10T08:00:00Z"
 *                   deliveryDate: "2026-03-11T08:00:00Z"
 *                   deliveryMode: "Delivery"
 *                   status: "in-progress"
 *               completed:
 *                 - orderId: "SC3400520"
 *                   amount: 72500
 *                   paymentMode: "Pos Machine"
 *                   bookingDate: "2026-03-10T08:00:00Z"
 *                   deliveryDate: "2026-03-11T08:00:00Z"
 *                   deliveryMode: "Pickup"
 *                   status: "completed"
 *               latestOrder:
 *                 - orderId: "SC7800736"
 *                   amount: 50000
 *                   paymentMode: "Card"
 *                   bookingDate: "2026-03-10T08:00:00Z"
 *                   deliveryDate: "2026-03-11T08:00:00Z"
 *                   deliveryMode: "Delivery"
 *                   status: "in-progress"
 *       401:
 *         description: Unauthorized — missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *       404:
 *         description: Admin not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Admin not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */

router.get('/dashboard', checkAdmin , dashboard)

module.exports = router