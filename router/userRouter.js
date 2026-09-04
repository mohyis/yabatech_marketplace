const router = require('express').Router()
const { register, updateUser,verifyEmail, resendOTP, forgotPassword, verifyForgotPassword, login, logout } = require('../controller/userController')
const { loginValidator, registerValidator, updateUserValidator } = require('../middleware/joiValidation')
const { checkUser } = require('../middleware/validation')
const { loginRateLimiter } = require('../middleware/rateLimiter')

router.post('/register', registerValidator, register)
router.put('/update-profile', checkUser, updateUserValidator, updateUser)
router.post('/verify-email', verifyEmail)
router.post('/resend-otp', resendOTP)
router.post('/forgot-password', forgotPassword)
router.post('/verify-forgot-password', verifyForgotPassword)
router.post('/login', loginRateLimiter , loginValidator, login)
router.post('/logout',authenticator, logout)

module.exports = router
