import { Request } from "express";
import rateLimit from "express-rate-limit";

import { TooManyRequestsException } from "@/exceptions/httpExceptions.js";

/**
 * If in serverless environment, use external storage to persist rate limits
 */
interface RateLimiterOptions {
  windowMs?: number;
  max?: number;
  message?: string;
}

const rateLimiter = (options: RateLimiterOptions = {}) => {
  return rateLimit({
    windowMs: options.windowMs || 1 * 60 * 1000, // Default to 1 minute
    max: options.max || 60, // Default to 60 requests per window
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    keyGenerator: (req: Request) => {
      // Use user ID if logged in, else fall back to IP
      return req.user ? req.user.id : req.ip;
    },
    handler: (req, res, next, options) => {
      next(new TooManyRequestsException(options.message));
    },
  });
};

export default rateLimiter;
