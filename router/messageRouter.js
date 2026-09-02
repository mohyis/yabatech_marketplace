const router = require('express').Router();
const { createMessage, getAllMessages, getOneMessage, deleteMessage } = require('../controller/messageController');
const { createMessageValidator } = require('../middleware/joiValidation');
const { checkAdmin } = require('../middleware/validation');

/**
 * @swagger
 * tags:
 *   name: Message
 *   description: Contact messages management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Message:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The Message MongoDB ID
 *           example: 787674563782983746578439
 *         name:
 *           type: string
 *           description: Sender's name
 *           example: John Doe
 *         email:
 *           type: string
 *           description: Sender's email
 *           example: john.doe@example.com
 *         subject:
 *           type: string
 *           description: Message subject
 *           example: Inquiry about laundry services
 *         message:
 *           type: string
 *           description: Message body
 *           example: I would like to know more about your pricing.
 */

/**
 * @swagger
 * /api/message/message:
 *   post:
 *     tags:
 *       - Message
 *     summary: Send a message
 *     description: Allows anyone to send a contact message (no authentication required)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - subject
 *               - message
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john.doe@example.com
 *               subject:
 *                 type: string
 *                 example: Inquiry about laundry services
 *               message:
 *                 type: string
 *                 example: I would like to know more about your pricing.
 *     responses:
 *       201:
 *         description: Message sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Message sent successfully
 *                 data:
 *                   $ref: '#/components/schemas/Message'
 */
router.post('/message', createMessageValidator ,createMessage);

/**
 * @swagger
 * /api/message/messages:
 *   get:
 *     tags:
 *       - Message
 *     summary: Get all messages
 *     description: Retrieves all contact messages. Requires admin authentication.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Messages retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Messages retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Message'
 */
router.get('/messages', checkAdmin, getAllMessages);

/**
 * @swagger
 * /api/message/messages/{id}:
 *   get:
 *     tags:
 *       - Message
 *     summary: Get a single message
 *     description: Retrieves a single contact message by ID. Requires admin authentication.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The Message MongoDB ID
 *         schema:
 *           type: string
 *           example: 787674563782983746578439
 *     responses:
 *       200:
 *         description: Message retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Message retrieved successfully
 *                 data:
 *                   $ref: '#/components/schemas/Message'
 *       404:
 *         description: Message not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Message not found
 *   delete:
 *     tags:
 *       - Message
 *     summary: Delete a message
 *     description: Deletes a contact message by ID. Requires admin authentication.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The Message MongoDB ID
 *         schema:
 *           type: string
 *           example: 787674563782983746578439
 *     responses:
 *       200:
 *         description: Message deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Message deleted successfully
 *                 data:
 *                   $ref: '#/components/schemas/Message'
 *       404:
 *         description: Message not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Message not found
 */
router.get('/messages/:id', checkAdmin, getOneMessage);
router.delete('/messages/:id', checkAdmin, deleteMessage);


module.exports = router;