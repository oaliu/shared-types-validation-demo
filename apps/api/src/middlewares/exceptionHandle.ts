import { ErrorRequestHandler } from "express";
import { StatusCodes } from "http-status-codes";

import logger from "@/config/logger.js";
import { BaseHttpException } from "@/exceptions/httpExceptions.js";

import { IApiError } from "@repo/shared";
const exceptionHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof BaseHttpException) {
    res.status(err.status).send({ ...err });
    return;
  }

  logger.error(err);

  // Internal Server Error
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
    status: StatusCodes.INTERNAL_SERVER_ERROR,
    name: "UnkownException",
    message: "Something went wrong!",
  } satisfies IApiError);
};

export default exceptionHandler;
