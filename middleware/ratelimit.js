const rateLimit = require('express-rate-limit')

const rateLimitMiddleware = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: "You have exceeded the rate limit. Please try again in 15 minutes.",
  headers: true,
});

module.exports = rateLimitMiddleware;