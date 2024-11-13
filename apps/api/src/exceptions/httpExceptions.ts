import { IApiError } from "@repo/shared";
import { StatusCodes } from "http-status-codes";
/**
 * All errors sent to the client should inherit from this class
 */
class BaseHttpException implements IApiError {
  constructor(
    public readonly status: StatusCodes,
    public readonly name: string,
    public readonly message: string,
    public readonly validationErrors?: Record<string, string>,
  ) {}
}

class BadRequestException extends BaseHttpException {
  constructor(message = "Bad Request") {
    super(StatusCodes.BAD_REQUEST, "BadRequestException", message);
  }
}

class ConflictException extends BaseHttpException {
  constructor(message = "Conflict") {
    super(StatusCodes.CONFLICT, "ConflictException", message);
  }
}

class ExpectationFailedException extends BaseHttpException {
  constructor(message = "Expectation Failed") {
    super(
      StatusCodes.EXPECTATION_FAILED,
      "ExpectationFailedException",
      message,
    );
  }
}

class ForbiddenException extends BaseHttpException {
  constructor(message = "Forbidden") {
    super(StatusCodes.FORBIDDEN, "ForbiddenException", message);
  }
}

class GoneException extends BaseHttpException {
  constructor(message = "Gone") {
    super(StatusCodes.GONE, "GoneException", message);
  }
}

class LengthRequiredException extends BaseHttpException {
  constructor(message = "Length Required") {
    super(StatusCodes.LENGTH_REQUIRED, "LengthRequiredException", message);
  }
}

class MethodNotAllowedException extends BaseHttpException {
  constructor(message = "Method Not Allowed") {
    super(StatusCodes.METHOD_NOT_ALLOWED, "MethodNotAllowedException", message);
  }
}

class NotAcceptableException extends BaseHttpException {
  constructor(message = "Not Acceptable") {
    super(StatusCodes.NOT_ACCEPTABLE, "NotAcceptableException", message);
  }
}

class NotFoundException extends BaseHttpException {
  constructor(message = "Not Found") {
    super(StatusCodes.NOT_FOUND, "NotFoundException", message);
  }
}

class PreconditionFailedException extends BaseHttpException {
  constructor(message = "Precondition Failed") {
    super(
      StatusCodes.PRECONDITION_FAILED,
      "PreconditionFailedException",
      message,
    );
  }
}

class TooManyRequestsException extends BaseHttpException {
  constructor(message = "Too Many Requests") {
    super(StatusCodes.TOO_MANY_REQUESTS, "TooManyRequestsException", message);
  }
}

class UnauthorizedException extends BaseHttpException {
  constructor(message = "Unauthorized") {
    super(StatusCodes.UNAUTHORIZED, "UnauthorizedException", message);
  }
}

class UnsupportedMediaException extends BaseHttpException {
  constructor(message = "Unsupported Media Type") {
    super(
      StatusCodes.UNSUPPORTED_MEDIA_TYPE,
      "UnsupportedMediaException",
      message,
    );
  }
}

class ValidationException extends BaseHttpException {
  constructor(
    validationErrors: Record<string, string> | undefined,
    message = "Validation Failed",
  ) {
    super(
      StatusCodes.UNPROCESSABLE_ENTITY,
      "ValidationException",
      message,
      validationErrors,
    );
  }
}

export {
  BaseHttpException,
  BadRequestException,
  ConflictException,
  ExpectationFailedException,
  ForbiddenException,
  GoneException,
  LengthRequiredException,
  MethodNotAllowedException,
  NotAcceptableException,
  NotFoundException,
  PreconditionFailedException,
  TooManyRequestsException,
  UnauthorizedException,
  UnsupportedMediaException,
  ValidationException,
};
