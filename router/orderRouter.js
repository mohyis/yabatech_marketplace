const router = require('express').Router();
const { getAllOrders, getOneOrder, updateOrderStatus, deleteOrder, getCompletedOrder, getCompleted, getInProgress, getCancelled, getNewRequests, createOrder, assignStaffToOrders, allCustomer } = require('../controller/orderController');
const { getOrdersWithNoStaffAssigned, assignStaffToSchedule } = require('../controller/orderController');
const {  updateOrderStatusValidator, createOrderValidator } = require('../middleware/joiValidation');
const {orderRateLimiter,} = require('../middleware/rateLimiter');

const { checkAdmin } = require('../middleware/validation');

/**
 * @swagger
 * tags:
 *   name: Order
 *   description: Order and schedule management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The Order MongoDB ID
 *           example: 787674563782983746578439
 *         orderId:
 *           type: string
 *           description: The generated Order ID
 *           example: "#SC-1234567"
 *         adminId:
 *           type: string
 *           description: The admin who created the order
 *           example: 787674563782983746578439
 *         customerId:
 *           type: string
 *           description: The associated customer ID
 *           example: 787674563782983746578439
 *         firstName:
 *           type: string
 *           example: Jane
 *         lastName:
 *           type: string
 *           example: Doe
 *         email:
 *           type: string
 *           example: jane.doe@example.com
 *         address:
 *           type: string
 *           example: 12 Lekki Phase 1, Lagos
 *         phoneNumber:
 *           type: string
 *           example: "+2348029837465"
 *         pickUpDate:
 *           type: string
 *           format: date
 *           example: "2026-06-01"
 *         pickUpTime:
 *           type: string
 *           example: "10:00 AM"
 *         deliveryMode:
 *           type: string
 *           example: delivery
 *         paymentMode:
 *           type: string
 *           example: online
 *         deliveryDate:
 *           type: string
 *           format: date-time
 *           example: "2026-06-03T00:00:00.000Z"
 *         readyDate:
 *           type: string
 *           format: date-time
 *           example: "2026-06-03T00:00:00.000Z"
 *         bookingDate:
 *           type: string
 *           format: date-time
 *           example: "2026-05-24T00:00:00.000Z"
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
 *         note:
 *           type: string
 *           example: Handle with care
 *         status:
 *           type: string
 *           example: new request
 *         staffName:
 *           type: string
 *           example: James Brown
 */

/**
 * @swagger
 * /api/order/create-order:
 *   post:
 *     tags:
 *       - Order
 *     summary: Create a laundry schedule
 *     description: Allows customers or admins to book a laundry pickup/delivery schedule. No authentication required.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - pickUpDate
 *               - pickUpTime
 *               - email
 *               - address
 *               - phoneNumber
 *               - deliveryMode
 *               - paymentMode
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: Jane
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               pickUpDate:
 *                 type: string
 *                 format: date
 *                 example: "2026-06-01"
 *               pickUpTime:
 *                 type: string
 *                 example: "10:00 AM"
 *               email:
 *                 type: string
 *                 example: jane.doe@example.com
 *               address:
 *                 type: string
 *                 example: 12 Lekki Phase 1, Lagos
 *               phoneNumber:
 *                 type: string
 *                 example: "+2348029837465"
 *               deliveryMode:
 *                 type: string
 *                 example: delivery
 *               paymentMode:
 *                 type: string
 *                 example: online
 *               item:
 *                 type: string
 *                 example: shirts
 *               specification:
 *                 type: string
 *                 example: dry clean only
 *               quantity:
 *                 type: number
 *                 example: 3
 *               amount:
 *                 type: number
 *                 example: 1500
 *               note:
 *                 type: string
 *                 example: Handle with care
 *     responses:
 *       201:
 *         description: Schedule created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Schedule created successfully
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Please fill in all required fields
 */
router.post('/create-order', createOrderValidator, orderRateLimiter, createOrder);

/**
 * @swagger
 * /api/order/orders:
 *   get:
 *     tags:
 *       - Order
 *     summary: Get all orders
 *     description: Retrieves all orders. Requires admin authentication.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All orders retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: All Orders retrieved successfully
 *                 requiredOrders:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 787674563782983746578439
 *                       orderId:
 *                         type: string
 *                         example: "#SC-1234567"
 *                       address:
 *                         type: string
 *                         example: 12 Lekki Phase 1, Lagos
 *                       amount:
 *                         type: number
 *                         example: 1500
 *                       paymentMode:
 *                         type: string
 *                         example: online
 *                       bookingDate:
 *                         type: string
 *                         format: date-time
 *                         example: "2026-05-24T00:00:00.000Z"
 *                       deliveryDate:
 *                         type: string
 *                         format: date-time
 *                         example: "2026-06-03T00:00:00.000Z"
 *                       deliveryMode:
 *                         type: string
 *                         example: delivery
 *                       status:
 *                         type: string
 *                         example: new request
 */
router.get('/orders', checkAdmin, getAllOrders);


/**
 * @swagger
 * /api/order/new-request:
 *   get:
 *     tags:
 *       - Order
 *     summary: Get all new requests
 *     description: Retrieves all new request orders. Requires admin authentication.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: New requests retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: New requests retrieved successfully
 *                 requiredOrders:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 787674563782983746578439
 *                       orderId:
 *                         type: string
 *                         example: "#SC-1234567"
 *                       address:
 *                         type: string
 *                         example: 12 Lekki Phase 1, Lagos
 *                       amount:
 *                         type: number
 *                         example: 1500
 *                       paymentMode:
 *                         type: string
 *                         example: online
 *                       bookingDate:
 *                         type: string
 *                         format: date-time
 *                         example: "2026-05-24T00:00:00.000Z"
 *                       deliveryDate:
 *                         type: string
 *                         format: date-time
 *                         example: "2026-06-03T00:00:00.000Z"
 *                       deliveryMode:
 *                         type: string
 *                         example: delivery
 *                       status:
 *                         type: string
 *                         example: new request
 */

router.get('/new-request', checkAdmin, getNewRequests)


/**
 * @swagger
 * /api/order/completed-orders:
 *   get:
 *     tags:
 *       - Order
 *     summary: Get all completed orders
 *     description: Retrieves all completed orders. Requires admin authentication.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Completed orders retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Completed orders retrieved successfully
 *                 requiredOrders:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 787674563782983746578439
 *                       orderId:
 *                         type: string
 *                         example: "#SC-1234567"
 *                       address:
 *                         type: string
 *                         example: 12 Lekki Phase 1, Lagos
 *                       amount:
 *                         type: number
 *                         example: 1500
 *                       paymentMode:
 *                         type: string
 *                         example: online
 *                       bookingDate:
 *                         type: string
 *                         format: date-time
 *                         example: "2026-05-24T00:00:00.000Z"
 *                       deliveryDate:
 *                         type: string
 *                         format: date-time
 *                         example: "2026-06-03T00:00:00.000Z"
 *                       deliveryMode:
 *                         type: string
 *                         example: delivery
 *                       status:
 *                         type: string
 *                         example: completed
 */
router.get('/completed-orders', checkAdmin, getCompleted)

/**
 * @swagger
 * /api/order/pending-orders:
 *   get:
 *     tags:
 *       - Order
 *     summary: Get all in-progress orders
 *     description: Retrieves all in-progress orders. Requires admin authentication.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: In-progress orders retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: In-progress orders retrieved successfully
 *                 requiredOrders:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 787674563782983746578439
 *                       orderId:
 *                         type: string
 *                         example: "#SC-1234567"
 *                       address:
 *                         type: string
 *                         example: 12 Lekki Phase 1, Lagos
 *                       amount:
 *                         type: number
 *                         example: 1500
 *                       paymentMode:
 *                         type: string
 *                         example: online
 *                       bookingDate:
 *                         type: string
 *                         format: date-time
 *                         example: "2026-05-24T00:00:00.000Z"
 *                       deliveryDate:
 *                         type: string
 *                         format: date-time
 *                         example: "2026-06-03T00:00:00.000Z"
 *                       deliveryMode:
 *                         type: string
 *                         example: delivery
 *                       status:
 *                         type: string
 *                         example: in-progress
 */
router.get('/pending-orders', checkAdmin, getInProgress)


/**
 * @swagger
 * /api/order/cancelled-orders:
 *   get:
 *     tags:
 *       - Order
 *     summary: Get all cancelled orders
 *     description: Retrieves all cancelled orders. Requires admin authentication.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cancelled orders retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Cancelled orders retrieved successfully
 *                 requiredOrders:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 787674563782983746578439
 *                       orderId:
 *                         type: string
 *                         example: "#SC-1234567"
 *                       address:
 *                         type: string
 *                         example: 12 Lekki Phase 1, Lagos
 *                       amount:
 *                         type: number
 *                         example: 1500
 *                       paymentMode:
 *                         type: string
 *                         example: online
 *                       bookingDate:
 *                         type: string
 *                         format: date-time
 *                         example: "2026-05-24T00:00:00.000Z"
 *                       deliveryDate:
 *                         type: string
 *                         format: date-time
 *                         example: "2026-06-03T00:00:00.000Z"
 *                       deliveryMode:
 *                         type: string
 *                         example: delivery
 *                       status:
 *                         type: string
 *                         example: cancelled
 */
router.get('/cancelled-orders', checkAdmin, getCancelled)



// router.get('/schedules/completed', checkAdmin, assignAllCompletedOrders);

/**
 * @swagger
 * /api/order/orders/{id}:
 *   get:
 *     tags:
 *       - Order
 *     summary: Get one order
 *     description: Retrieves details of a specific order by ID. Requires admin authentication.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the order to retrieve
 *         schema:
 *           type: string
 *           example: 787674563782983746578439
 *     responses:
 *       200:
 *         description: Order details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Order details retrieved successfully
 *                 customer:
 *                   type: object
 *                   properties:
 *                     firstname:
 *                       type: string
 *                       example: John
 *                     lastname:
 *                       type: string
 *                       example: Doe
 *                     address:
 *                       type: string
 *                       example: 10:00 AM
 *                     phoneNumber:
 *                       type: string
 *                       example: "08012345678"
 *                     email:
 *                       type: string
 *                       example: johndoe@gmail.com
 *                 booking:
 *                   type: object
 *                   properties:
 *                     orderId:
 *                       type: string
 *                       example: "#SC-1234567"
 *                     item:
 *                       type: string
 *                       example: Clothes
 *                     specification:
 *                       type: string
 *                       example: Wash and iron
 *                     quantity:
 *                       type: number
 *                       example: 5
 *                     paymentMode:
 *                       type: string
 *                       example: online
 *                     readyDate:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-06-03T00:00:00.000Z"
 *                     deliveryMode:
 *                       type: string
 *                       example: delivery
 *                 payments:
 *                   type: object
 *                   properties:
 *                     OrderId:
 *                       type: string
 *                       example: "#SC-1234567"
 *                     item:
 *                       type: string
 *                       example: Clothes
 *                     specification:
 *                       type: string
 *                       example: Wash and iron
 *                     unitPrice:
 *                       type: number
 *                       example: 500
 *                     amount:
 *                       type: number
 *                       example: 2500
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Order not found
 */

router.get('/orders/:id', checkAdmin, getOneOrder);

/**
 * @swagger
 * /api/order/order-status/{id}:
 *   put:
 *     tags:
 *       - Order
 *     summary: Update order status
 *     description: Updates the status of an order matching the given orderId and admin. Requires admin authentication.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The Order ID (orderId field, e.g. #SC-1234567)
 *         schema:
 *           type: string
 *           example: "#SC-1234567"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 description: The new order status
 *                 enum: [new request, in-progress, completed, cancelled]
 *                 example: in-progress
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Order status updated successfully
 *                 order:
 *                   $ref: '#/components/schemas/Order'
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Order not found
 */
router.put('/order-status/:id', updateOrderStatusValidator ,checkAdmin, updateOrderStatus);


/**
 * @swagger
 * /api/order/orders/{id}:
 *   delete:
 *     tags:
 *       - Order
 *     summary: Delete an order
 *     description: Deletes a specific order by ID. Requires admin authentication.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the order to delete
 *         schema:
 *           type: string
 *           example: 787674563782983746578439
 *     responses:
 *       200:
 *         description: Order deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Order deleted successfully
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Order not found
 */
router.delete('/orders/:id', checkAdmin, deleteOrder);



/**
 * @swagger
 * /api/order/order/unassigned-orders:
 *   get:
 *     tags:
 *       - Order
 *     summary: Get completed orders without staff assigned
 *     description: Retrieves all completed orders that have not yet been assigned to a staff member for delivery or pickup. Requires admin authentication.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Completed orders retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Completed Orders retrieved successfully
 *                 requiredSchedules:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 787674563782983746578439
 *                       orderId:
 *                         type: string
 *                         example: "#SC-1234567"
 *                       address:
 *                         type: string
 *                         example: 12 Lekki Phase 1, Lagos
 *                       deliveryMode:
 *                         type: string
 *                         example: delivery
 *                       deliveryDate:
 *                         type: string
 *                         format: date-time
 *                         example: "2026-06-03T00:00:00.000Z"
 *                       deliveryTime:
 *                         type: string
 *                         format: date-time
 *                         example: "2026-06-03T10:00:00.000Z"
 *                       status:
 *                         type: string
 *                         example: completed
 *                       staffName:
 *                         type: string
 *                         example: Not assigned yet
 */
router.post('/unassigned-orders', checkAdmin, getOrdersWithNoStaffAssigned);


/**
 * @swagger
 * /api/order/order/{id}:
 *   put:
 *     tags:
 *       - Order
 *     summary: Assign staff to a completed order
 *     description: Assigns a staff member to a completed order for delivery or pickup. Requires admin authentication.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The Order MongoDB ID
 *         schema:
 *           type: string
 *           example: 787674563782983746578439
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idStaff
 *               - vehicleType
 *               - duty
 *             properties:
 *               idStaff:
 *                 type: string
 *                 description: The generated staff ID (e.g. #SCS-AB1234-42)
 *                 example: "#SCS-AB1234-42"
 *               staffName:
 *                 type: string
 *                 description: Optional override for staff name
 *                 example: James Brown
 *               vehicleType:
 *                 type: string
 *                 example: motorcycle
 *               duty:
 *                 type: string
 *                 example: delivery
 *     responses:
 *       200:
 *         description: Staff assigned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Staff assigned successfully
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Order is not completed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Only completed orders can be assigned to staff
 *       404:
 *         description: Staff or schedule not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Staff not found
 */
router.put('/order/:id', checkAdmin, assignStaffToOrders);


/**
 * @swagger
 * /api/order/customers:
 *   get:
 *     tags:
 *       - Order
 *     summary: Get all customers
 *     description: Retrieves all customers and their order details. Requires admin authentication.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All customers retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: All customers retrieved successfully
 *                 requiredCustomer:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       customerId:
 *                         type: string
 *                         example: "#SC-1234567"
 *                       customerEmail:
 *                         type: string
 *                         example: johndoe@gmail.com
 *                       customerPhoneNumber:
 *                         type: string
 *                         example: "08012345678"
 *                       orderAmount:
 *                         type: number
 *                         example: 5000
 *                       amountSpent:
 *                         type: number
 *                         example: 15000
 *                       lastOrder:
 *                         type: string
 *                         format: date-time
 *                         example: "2026-05-24T00:00:00.000Z"
 */
router.get('/customers', checkAdmin, allCustomer)

module.exports = router;

