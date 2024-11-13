import { RequestHandler } from "express";
import morgan from "morgan";

/**
 * Middleware to log HTTP requests  only in 'development'.
 */
const httpRequestLogger: RequestHandler = (req, res, next) => {
  morgan("dev")(req, res, next);
};

export default httpRequestLogger;
