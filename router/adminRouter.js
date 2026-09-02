const router = require('express').Router()
const passport = require('passport')
// const { upload } = require('../middleware/multer')
const { register, login, logout } = require('../controller/adminController')
const { loginValidator, registerValidator } = require('../middleware/joiValidation')
const { authenticator } = require('../middleware/validation')
const { loginRateLimiter } = require('../middleware/rateLimiter')


/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin authentication and management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Admin:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Admin ID
 *           example: 787674563782983746578439
 *         firstName:
 *           type: string
 *           description: Admin first name
 *           example: John
 *         lastName:
 *           type: string
 *           description: Admin last name
 *           example: Doe
 *         email:
 *           type: string
 *           description: Admin email
 *           example: admin@example.com
 *         password:
 *           type: string
 *           description: Admin password (hashed)
 *           example: $2b$10$hashedpasswordhere
 *         loginAttempts:
 *           type: number
 *           description: Number of consecutive failed login attempts
 *           example: 0
 *         lockUntil:
 *           type: string
 *           format: date-time
 *           description: Timestamp until which the account is locked after 5 failed attempts
 *           example: "2026-05-24T10:02:00.000Z"
 */

/**
 * @swagger
 * /api/admin/register:
 *   post:
 *     tags:
 *       - Admin
 *     summary: Admin registration
 *     description: Create a new admin account
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
 *               - password
 *               - confirmPassword
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 example: Password@123
 *               confirmPassword:
 *                 type: string
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
 *                       example: John
 *                     lastName:
 *                       type: string
 *                       example: Doe
 *                     email:
 *                       type: string
 *                       example: admin@example.com
 *       400:
 *         description: Passwords do not match
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: password does not match
 */
router.post('/register', registerValidator, register)
// router.post('/register', registerValidator ,upload.single('photo'), register)




/**
 * @swagger
 * /api/admin/login:
 *   post:
 *     tags:
 *       - Admin
 *     summary: Admin login
 *     description: >
 *       Login with email and password. A JWT token is issued on success and stored in Redis
 *       for the session (expires in 1 day). After 5 consecutive failed attempts the account
 *       is locked for 2 minutes.
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
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 example: Password@123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: login successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 787674563782983746578439
 *                     firstName:
 *                       type: string
 *                       example: John
 *                     lastName:
 *                       type: string
 *                       example: Doe
 *                     email:
 *                       type: string
 *                       example: admin@example.com
 *                 token:
 *                   type: string
 *                   example: jwt.token.here
 *       400:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: invalid credentials
 *       403:
 *         description: Account locked due to too many failed login attempts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Account locked until 2026-05-24T10:02:00.000Z"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: user not found
 */
router.post('/login', loginRateLimiter , loginValidator, login)

/**
 * @swagger
 * /api/admin/logout:
 *   post:
 *     tags:
 *       - Admin
 *     summary: Admin logout
 *     description: Invalidates the admin session by deleting the JWT token from Redis. Requires admin authentication.
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
router.post('/logout',authenticator, logout)

/**
 * @swagger
 * /api/admin/googleAuth:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Google authentication
 *     description: Redirects the user to Google OAuth login
 *     responses:
 *       302:
 *         description: Redirect to Google auth page
 */
router.get('/googleAuth', passport.authenticate("google", { scope: ["profile", "email"] }))

/**
 * @swagger
 * /api/admin/googleLogin:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Google login callback
 *     description: Handles the Google OAuth callback and redirects to success or failure route
 *     responses:
 *       302:
 *         description: Redirects to success or failure route
 */
router.get('/googleLogin', passport.authenticate("google", {successRedirect: "/api/admin/success", failureRedirect: "/api/admin/failed"}))

/**
 * @swagger
 * /api/admin/success:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Google login success
 *     description: Returns the logged-in admin's token from the Google OAuth flow
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: login successful
 *                 data:
 *                   type: string
 *                   description: JWT token
 *                   example: jwt.token.here
 */
router.get('/success', (req, res) => {
    res.json({
        message: "login successful",
        data: req.user
    })
})

/**
 * @swagger
 * /api/admin/failed:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Google login failed
 *     description: Returns a failure message when Google OAuth login is unsuccessful
 *     responses:
 *       200:
 *         description: Login failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: login Failed
 */
router.get('/failed', (req, res) => {
    res.json({
        message: "login Failed"
    })
})

module.exports = router

