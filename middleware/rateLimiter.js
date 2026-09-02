const { rateLimit } = require('express-rate-limit')

exports.orderRateLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 10,
    message: 'too many request, please try again after 5mins'
})
exports.loginRateLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 10,
    message: 'too many request, please try again after 5mins'
})
exports.paymentRateLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 5,
    message: 'too many request, please try again after 1mins'
})

