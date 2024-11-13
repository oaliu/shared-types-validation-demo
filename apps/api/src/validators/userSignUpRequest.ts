import { Request, NextFunction } from "express";
import { ZodSchema } from "zod";

import { User } from "@/models/user.js";
import { ValidationException } from "@/exceptions/httpExceptions.js";
import RequestValidator from "@/validators/requestValidator.js";

import { signUpSchema } from "@repo/shared";

export default class UserSignUpRequest extends RequestValidator {
  public authorized = async (): Promise<boolean> => true;

  public schema = (): ZodSchema => signUpSchema;

  public after = async (req: Request, next: NextFunction): Promise<void> => {
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      next(new ValidationException({ email: "Email already registered" }));
    }

    next();
  };
}
