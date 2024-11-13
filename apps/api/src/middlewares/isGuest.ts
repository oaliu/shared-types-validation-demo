import { RequestHandler } from "express";

import { ForbiddenException } from "@/exceptions/httpExceptions.js";

const isGuest: RequestHandler = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return next();
  }

  next(new ForbiddenException());
};

export default isGuest;
