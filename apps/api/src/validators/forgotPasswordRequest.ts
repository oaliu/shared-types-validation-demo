import { Request, NextFunction } from "express";
import { ZodSchema } from "zod";

import { User } from "@/models/user.js";
import RequestValidator from "@/validators/requestValidator.js";
import { ValidationException } from "@/exceptions/httpExceptions.js";

import { forgotPasswordSchema } from "@repo/shared";

export default class ForgotPasswordRequest extends RequestValidator {
  public authorized = async (): Promise<boolean> => true;

  public schema = (): ZodSchema => forgotPasswordSchema;

  public after = async (req: Request, next: NextFunction): Promise<void> => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      next(new ValidationException({ email: "Email is not registered" }));
    }

    next();
  };
}
