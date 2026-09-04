const router = require('express').Router()
const { register, verifyEmail, resendOTP, forgotPassword, verifyForgotPassword, login, logout } = require('../controller/userController')
const { loginValidator, registerValidator } = require('../middleware/joiValidation')
const { authenticator } = require('../middleware/validation')
const { loginRateLimiter } = require('../middleware/rateLimiter')

router.post('/register', registerValidator, register)
router.post('/verify-email', verifyEmail)
router.post('/resend-otp', resendOTP)
router.post('/forgot-password', forgotPassword)
router.post('/verify-forgot-password', verifyForgotPassword)
router.post('/login', loginRateLimiter , loginValidator, login)
router.post('/logout',authenticator, logout)

module.exports = router
