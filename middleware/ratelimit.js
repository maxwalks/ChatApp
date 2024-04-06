const rateLimit = require('express-rate-limit')

const rateLimitMiddleware = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "You have exceeded the rate limit. Please try again in 15 minutes.",
});

module.exports = rateLimitMiddleware;