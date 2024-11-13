import { ZodSchema } from "zod";

import RequestValidator from "@/validators/requestValidator.js";

import { resetPasswordSchema } from "@repo/shared";

export default class ResetPasswordRequest extends RequestValidator {
  public authorized = async (): Promise<boolean> => true;

  public schema = (): ZodSchema => resetPasswordSchema;
}
