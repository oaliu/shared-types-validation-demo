import { RequestHandler } from "express";

import {
  ForbiddenException,
  UnauthorizedException,
} from "@/exceptions/httpExceptions.js";

const isAuthenticated: RequestHandler = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next(new UnauthorizedException());
  }

  if (req.user?.isVerified === false) {
    next(new ForbiddenException("USER_NOT_VERIFIED"));
  }

  return next();
};

export default isAuthenticated;
