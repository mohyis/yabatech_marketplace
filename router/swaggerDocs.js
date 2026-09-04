/**
 * @swagger
 * tags:
 *   - name: User
 *     description: User account registration, authentication and password management
 *   - name: Product
 *     description: Product management (create, read, update, delete) for authenticated users
 *
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: User Mongo ObjectId
 *           example: 787674563782983746578d9f
 *         firstName:
 *           type: string
 *           example: John
 *         lastName:
 *           type: string
 *           example: Doe
 *         matricNumber:
 *           type: string
 *           example: YAB/19/1234
 *         department:
 *           type: string
 *           example: Computer Engineering
 *         level:
 *           type: string
 *           example: "300"
 *         email:
 *           type: string
 *           example: johndoe@gmail.com
 *         phoneNumber:
 *           type: string
 *           example: "+2348029837465"
 *         password:
 *           type: string
 *           description: Hashed password (never returned to the client)
 *           example: $2b$10$hashedpasswordhere
 *         role:
 *           type: string
 *           example: user
 *         isVerified:
 *           type: boolean
 *           example: false
 *         loginAttempts:
 *           type: number
 *           example: 0
 *         lockUntil:
 *           type: string
 *           format: date-time
 *     AuthResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: login successfully
 *         data:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             firstName:
 *               type: string
 *             lastName:
 *               type: string
 *             email:
 *               type: string
 *         token:
 *           type: string
 *           description: JWT access token (expires in 1 day)
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     Product:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Product Mongo ObjectId
 *           example: 7876745637829837465789d9
 *         userId:
 *           type: string
 *           description: ObjectId of the user who owns the product
 *           example: 787674563782983746578d9f
 *         productName:
 *           type: string
 *           example: Samsung Galaxy S23
 *         category:
 *           type: string
 *           example: Phones
 *         condition:
 *           type: string
 *           enum: [new, used-like new, used-good condition, used-fair condition]
 *           example: used-like new
 *         price:
 *           type: number
 *           example: 250000
 *         description:
 *           type: string
 *           example: Slightly used Samsung Galaxy S23
 *         image:
 *           type: string
 *           description: Cloudinary image URL
 *           example: https://res.cloudinary.com/demo/image/upload/v1234/img.jpg
 *         imagePublicId:
 *           type: string
 *           example: marketplace/img_12345
 *         phoneNumber:
 *           type: string
 *           example: "+2348029837465"
 *         status:
 *           type: string
 *           enum: [available, sold]
 *           example: available
 *     ProductSummary:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         productName:
 *           type: string
 *         category:
 *           type: string
 *         condition:
 *           type: string
 *         price:
 *           type: number
 *         description:
 *           type: string
 *         image:
 *           type: string
 *         phoneNumber:
 *           type: string
 *         status:
 *           type: string
 *           enum: [available, sold]
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         status:
 *           type: number
 *       description: Error response returned by the global error handler
 */

// ============================================================
// USER / AUTHENTICATION ENDPOINTS
// ============================================================

/**
 * @swagger
 * /api/user/register:
 *   post:
 *     tags:
 *       - User
 *     summary: Register a new user
 *     description: Creates a user account, hashes the password, and sends a 6-digit OTP verification email.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - matricNumber
 *               - department
 *               - level
 *               - email
 *               - phoneNumber
 *               - password
 *               - confirmPassword
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               matricNumber:
 *                 type: string
 *                 example: YAB/19/1234
 *               department:
 *                 type: string
 *                 example: Computer Engineering
 *               level:
 *                 type: string
 *                 example: "300"
 *               email:
 *                 type: string
 *                 example: johndoe@gmail.com
 *               phoneNumber:
 *                 type: string
 *                 example: "+2348029837465"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password@123
 *               confirmPassword:
 *                 type: string
 *                 format: password
 *                 example: Password@123
 *     responses:
 *       201:
 *         description: Account created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: account created
 *                 data:
 *                   type: object
 *                   properties:
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *                     email:
 *                       type: string
 *       400:
 *         description: Validation failed or passwords do not match
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: password does not match
 *       409:
 *         description: Email is already in use
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: email already in use
 */
/**
 * @swagger
 * /api/user/update-profile:
 *   put:
 *     tags:
 *       - User
 *     summary: Update the current user's profile details
 *     description: Updates the authenticated user's profile (firstName, lastName, matricNumber, department, level, email, phoneNumber).
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               matricNumber:
 *                 type: string
 *                 example: YAB/19/1234
 *               department:
 *                 type: string
 *                 example: Computer Engineering
 *               level:
 *                 type: string
 *                 example: "300"
 *               email:
 *                 type: string
 *                 example: johndoe@gmail.com
 *               phoneNumber:
 *                 type: string
 *                 example: "+2348029837465"
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *                     matricNumber:
 *                       type: string
 *                     department:
 *                       type: string
 *                     level:
 *                       type: string
 *                     email:
 *                       type: string
 *                     phoneNumber:
 *                       type: string
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: First name must contain only letters and be at least 3 characters long
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Login required / invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/user/verify-email:
 *   post:
 *     tags:
 *       - User
 *     summary: Verify a user's email with OTP
 *     description: Validates the email and 6-digit OTP and marks the account as verified.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *                 example: johndoe@gmail.com
 *               otp:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Verification successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Verification successful
 *                 email:
 *                   type: string
 *       400:
 *         description: Invalid or expired OTP
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/user/resend-otp:
 *   post:
 *     tags:
 *       - User
 *     summary: Resend OTP verification code
 *     description: Regenerates a new 6-digit OTP (valid for 2 minutes) and emails it to the user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: johndoe@gmail.com
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: OTP sent successfully
 *                 email:
 *                   type: string
 *       404:
 *         description: Invalid credentials (user not found)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/user/forgot-password:
 *   post:
 *     tags:
 *       - User
 *     summary: Request password reset OTP
 *     description: Sends a 6-digit OTP (valid for 2 minutes) to the user's email for password reset.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: johndoe@gmail.com
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: OTP sent successfully
 *       404:
 *         description: Invalid credentials (user not found)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/user/verify-forgot-password:
 *   post:
 *     tags:
 *       - User
 *     summary: Verify password-reset OTP
 *     description: Validates the OTP for password reset and allows the reset to proceed.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *                 example: johndoe@gmail.com
 *               otp:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Verification successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Verification successfully
 *       400:
 *         description: Invalid or expired OTP
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/user/reset-password:
 *   post:
 *     tags:
 *       - User
 *     summary: Reset user password
 *     description: Resets the password after a successful forgot-password verification.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - newPassword
 *               - confirmPassword
 *             properties:
 *               email:
 *                 type: string
 *                 example: johndoe@gmail.com
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 example: NewPassword@123
 *               confirmPassword:
 *                 type: string
 *                 format: password
 *                 example: NewPassword@123
 *     responses:
 *       200:
 *         description: Password reset successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password Reset successfully
 *       400:
 *         description: Passwords do not match
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Unauthorized to perform this action (password reset not verified)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/user/login:
 *   post:
 *     tags:
 *       - User
 *     summary: Login a user
 *     description: Authenticates a user with email and password. On success a JWT is issued and stored in Redis.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: johndoe@gmail.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password@123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Email not verified or invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: please verify your email
 *       403:
 *         description: Account is locked
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Account locked until 2026-05-24T10:02:00.000Z
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/user/logout:
 *   post:
 *     tags:
 *       - User
 *     summary: Logout the current user
 *     description: Invalidates the user's session by deleting the JWT token from Redis. Requires authentication.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: logout successful
 */

// ============================================================
// PRODUCT ENDPOINTS
// ============================================================

/**
 * @swagger
 * /api/product:
 *   post:
 *     tags:
 *       - Product
 *     summary: Create a new product
 *     description: Creates a product for the authenticated user. An image file is uploaded to Cloudinary.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - productName
 *               - category
 *               - condition
 *               - price
 *               - description
 *               - image
 *               - phoneNumber
 *               - status
 *             properties:
 *               productName:
 *                 type: string
 *                 example: Samsung Galaxy S23
 *               category:
 *                 type: string
 *                 example: Phones
 *               condition:
 *                 type: string
 *                 enum: [new, used]
 *                 example: used
 *               price:
 *                 type: number
 *                 example: 250000
 *               description:
 *                 type: string
 *                 example: Slightly used Samsung Galaxy S23, 128GB, full box
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Product image file
 *               phoneNumber:
 *                 type: string
 *                 example: "+2348029837465"
 *               status:
 *                 type: string
 *                 enum: [available, sold]
 *                 example: available
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product created successfully
 *                 data:
 *                   $ref: '#/components/schemas/Product'
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
 *   get:
 *     tags:
 *       - Product
 *     summary: Get all products for the current user
 *     description: Retrieves all products belonging to the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: All products retrieved successfully
 *                 requiredProducts:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ProductSummary'
 */

/**
 * @swagger
 * /api/product/{id}:
 *   put:
 *     tags:
 *       - Product
 *     summary: Update a product
 *     description: Updates a product owned by the authenticated user. An optionally provided new image is uploaded to Cloudinary.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Product Mongo ObjectId
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - productName
 *               - category
 *               - condition
 *               - price
 *               - description
 *               - image
 *               - phoneNumber
 *               - status
 *             properties:
 *               productName:
 *                 type: string
 *                 example: Samsung Galaxy S23
 *               category:
 *                 type: string
 *                 example: Phones
 *               condition:
 *                 type: string
 *                 enum: [new, used]
 *                 example: used
 *               price:
 *                 type: number
 *                 example: 230000
 *               description:
 *                 type: string
 *                 example: Slightly used Samsung Galaxy S23
 *               image:
 *                 type: string
 *                 format: binary
 *               phoneNumber:
 *                 type: string
 *                 example: "+2348029837465"
 *               status:
 *                 type: string
 *                 enum: [available, sold]
 *                 example: available
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/Product'
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
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     tags:
 *       - Product
 *     summary: Delete a product
 *     description: Deletes a product owned by the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Product Mongo ObjectId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product deleted successfully
 *                 product:
 *                   $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/product/{id}/status:
 *   put:
 *     tags:
 *       - Product
 *     summary: Update a product's status
 *     description: Updates the status (available / sold) of a product owned by the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Product Mongo ObjectId
 *         schema:
 *           type: string
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
 *                 enum: [available, sold]
 *                 example: sold
 *     responses:
 *       200:
 *         description: Product status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product status updated successfully
 *                 product:
 *                   $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/product/available:
 *   get:
 *     tags:
 *       - Product
 *     summary: Get all available products for the current user
 *     description: Retrieves all products with status 'available' belonging to the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Available products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Available products retrieved successfully
 *                 requiredProducts:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ProductSummary'
 */

/**
 * @swagger
 * /api/product/sold:
 *   get:
 *     tags:
 *       - Product
 *     summary: Get all sold products for the current user
 *     description: Retrieves all products with status 'completed' belonging to the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sold products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Sold products retrieved successfully
 *                 requiredProducts:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ProductSummary'
 */

/**
 * @swagger
 * /api/product/total-sold:
 *   get:
 *     tags:
 *       - Product
 *     summary: Get total sold products count
 *     description: Returns the number of products with status 'sold' for the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Total sold products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Total sold products retrieved successfully
 *                 totalSoldProducts:
 *                   type: number
 *                   example: 3
 */

/**
 * @swagger
 * /api/product/total-available:
 *   get:
 *     tags:
 *       - Product
 *     summary: Get total available products count
 *     description: Returns the number of products with status 'available' for the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Total available products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Total available products retrieved successfully
 *                 totalAvailableProducts:
 *                   type: number
 *                   example: 4
 */
