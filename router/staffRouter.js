// const { createStaff, getAllStaff, getOneStaff } = require('../controller/staffController')

const router = require('express').Router()

const { createStaff, getAllStaff, getOneStaff, updateStaff, deleteStaff } = require('../controller/staffController');
const { createStaffValidator } = require('../middleware/joiValidation');
const { checkAdmin } = require('../middleware/validation');

/**
 * @swagger
 * tags:
 *   name: Staff
 *   description: Staff management (Admin only)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Staff:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Staff MongoDB ID
 *           example: 787674563782983746578439
 *         staffId:
 *           type: string
 *           description: Generated staff ID
 *           example: "#SCS-AB1234-42"
 *         adminId:
 *           type: string
 *           description: Admin who created the staff record
 *           example: 787674563782983746578439
 *         PERSONAL_INFO:
 *           type: object
 *           properties:
 *             firstName:
 *               type: string
 *               example: James
 *             lastName:
 *               type: string
 *               example: Brown
 *             email:
 *               type: string
 *               example: james.brown@example.com
 *             phoneNumber:
 *               type: string
 *               example: "+2348029837465"
 *             address:
 *               type: string
 *               example: 5 Victoria Island, Lagos
 *             position:
 *               type: string
 *               example: driver
 *         EDUCATION_CREDENTIALS:
 *           type: object
 *           properties:
 *             bscScience:
 *               type: string
 *               example: BSc Computer Science
 *             schoolAttended:
 *               type: string
 *               example: University of Lagos
 *             professionalCerts:
 *               type: string
 *               example: CISCO Certified Network Associate
 *         GUARANTOR_INFO:
 *           type: object
 *           properties:
 *             firstName:
 *               type: string
 *               example: Michael
 *             lastName:
 *               type: string
 *               example: Brown
 *             email:
 *               type: string
 *               example: michael.brown@example.com
 *             phoneNumber:
 *               type: string
 *               example: "+2348029837465"
 *             address:
 *               type: string
 *               example: 5 Victoria Island, Lagos
 *             relationship:
 *               type: string
 *               example: brother
 */

/**
 * @swagger
 * /api/staff/register:
 *   post:
 *     tags:
 *       - Staff
 *     summary: Create a new staff member
 *     description: Admin registers a new staff member with personal, educational, and guarantor details. Requires admin authentication.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - phoneNumber
 *               - address
 *               - position
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: James
 *               lastName:
 *                 type: string
 *                 example: Brown
 *               email:
 *                 type: string
 *                 example: james.brown@example.com
 *               phoneNumber:
 *                 type: string
 *                 example: "+2348029837465"
 *               address:
 *                 type: string
 *                 example: 5 Victoria Island, Lagos
 *               position:
 *                 type: string
 *                 example: driver
 *               bscScience:
 *                 type: string
 *                 example: BSc Computer Science
 *               schoolAttended:
 *                 type: string
 *                 example: University of Lagos
 *               professionalCerts:
 *                 type: string
 *                 example: CISCO Certified Network Associate
 *               guarantorFirstName:
 *                 type: string
 *                 example: Michael
 *               guarantorLastName:
 *                 type: string
 *                 example: Brown
 *               guarantorEmail:
 *                 type: string
 *                 example: michael.brown@example.com
 *               guarantorPhoneNumber:
 *                 type: string
 *                 example: "+2348029837465"
 *               guarantorAddress:
 *                 type: string
 *                 example: 5 Victoria Island, Lagos
 *               relationship:
 *                 type: string
 *                 example: brother
 *     responses:
 *       201:
 *         description: Staff created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Staff created successfully
 *                 data:
 *                   $ref: '#/components/schemas/Staff'
 *       400:
 *         description: Staff already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Staff already exist
 */
router.post('/register', createStaffValidator ,checkAdmin, createStaff);

/**
 * @swagger
 * /api/staff/staffs:
 *   get:
 *     tags:
 *       - Staff
 *     summary: Get all staff members
 *     description: Retrieves all staff records. Requires admin authentication.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All staff retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: All staffs retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Staff'
 */
router.get('/staffs', checkAdmin, getAllStaff);

/**
 * @swagger
 * /api/staff/staffs/{id}:
 *   get:
 *     tags:
 *       - Staff
 *     summary: Get a single staff member
 *     description: Retrieves a staff member by their MongoDB ID. Requires admin authentication.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The Staff MongoDB ID
 *         schema:
 *           type: string
 *           example: 787674563782983746578439
 *     responses:
 *       200:
 *         description: Staff retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Staff retrieved successfully
 *                 data:
 *                   $ref: '#/components/schemas/Staff'
 *       404:
 *         description: Staff not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Staff not found
 */
router.get('/staffs/:id', checkAdmin, getOneStaff);

/**
 * @swagger
 * /api/staff/staffs/{id}:
 *   put:
 *     tags:
 *       - Staff
 *     summary: Update a staff member
 *     description: Updates a staff member's personal details by MongoDB ID. Requires admin authentication.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The Staff MongoDB ID
 *         schema:
 *           type: string
 *           example: 787674563782983746578439
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: James
 *               lastName:
 *                 type: string
 *                 example: Brown
 *               email:
 *                 type: string
 *                 example: james.brown@example.com
 *               phoneNumber:
 *                 type: string
 *                 example: "+2348029837465"
 *               address:
 *                 type: string
 *                 example: 5 Victoria Island, Lagos
 *               position:
 *                 type: string
 *                 example: driver
 *               status:
 *                 type: string
 *                 example: active
 *     responses:
 *       200:
 *         description: Staff updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Staff updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/Staff'
 *       404:
 *         description: Staff not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Staff not found
 */
router.put('/staffs/:id', checkAdmin, updateStaff);

/**
 * @swagger
 * /api/staff/staffs/{id}:
 *   delete:
 *     tags:
 *       - Staff
 *     summary: Delete a staff member
 *     description: Deletes a staff record by MongoDB ID. Requires admin authentication.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The Staff MongoDB ID
 *         schema:
 *           type: string
 *           example: 787674563782983746578439
 *     responses:
 *       200:
 *         description: Staff deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Staff deleted successfully
 *       404:
 *         description: Staff not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Staff not found
 */
router.delete('/staffs/:id', checkAdmin, deleteStaff);

module.exports = router;

