import { ZodSchema } from "zod";

import RequestValidator from "@/validators/requestValidator.js";
import { signInSchema } from "@repo/shared";

export default class UserSignInRequest extends RequestValidator {
  public authorized = async (): Promise<boolean> => true;

  public schema = (): ZodSchema => signInSchema;
}
