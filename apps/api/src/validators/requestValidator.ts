import { z, ZodSchema } from "zod";
import { Request, NextFunction, RequestHandler } from "express";

import {
  UnauthorizedException,
  ValidationException,
} from "@/exceptions/httpExceptions.js";

/*
 * A base class for payloads validation middleware using Zod schemas.
 * It provides a common structure for validating requests and handling validation errors.
 */
export default class RequestValidator {
  public validate: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      // Step 1: Check if the request is authorized
      const authorised = await this.authorized();

      // If not authorized, throw an exception
      if (!authorised) {
        throw new UnauthorizedException();
      }

      // Step 2: Prepare the request for validation (e.g., modify or transform data if needed)
      await this.prepareForValidation(req);

      // Step 3: Retrieve the validation schema
      const schema = this.schema();

      // Step 4: Validate the request body against the schema
      const validationResult = schema.safeParse(req.body);

      if (!validationResult.success) {
        // If validation fails, format errors into an object
        const validationErrors = this.getErrorsAsFlatObject(
          validationResult.error.errors,
        );

        // Pass the validation errors to the next middleware as a ValidationException
        next(new ValidationException(validationErrors));
        return;
      }

      // If validation is successful, update the request body with the validated data
      req.body = validationResult.data;

      // Step 5: Perform any post-validation actions
      await this.after(req, next);
    } catch (error) {
      next(error);
    }
  };

  // Method to determine if the request is authorized (should be overridden in subclasses)
  protected authorized = async (): Promise<boolean> => false;

  // Method to define the Zod schema for validation (should be overridden in subclasses)
  protected schema = (): ZodSchema => z.object({});

  // Hook to prepare the request before validation (can be overridden in subclasses)
  protected prepareForValidation = async (req: Request): Promise<void> => {
    return;
  };

  // Hook to perform additional actions after successful validation (can be overridden in subclasses)
  protected after = async (req: Request, next: NextFunction): Promise<void> => {
    next();
  };

  // Converts Zod error array into an object mapping field names to error messages
  protected getErrorsAsFlatObject = (
    errors: Array<Record<string, any>>,
  ): Record<string, string> => {
    const errorsByField = errors.reduce((acc: any, curr: any) => {
      // Combine error messages by joining the path to form a string key (e.g., "path.to.field")
      const path = curr.path.join(".");
      acc[path] = curr.message;
      return acc;
    }, {});

    return errorsByField;
  };
}
