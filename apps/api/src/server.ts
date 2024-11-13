import express, { type Express, json, urlencoded } from "express";
import mongoose from "mongoose";
import passport from "passport";

import env from "@/config/envConfig.js";
import corsOptions from "@/config/corsOptions.js";
import logger from "@/config/logger.js";
import PassportHandler from "@/config/passportHandler.js";

import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import cookieParser from "cookie-parser";
import exceptionHandler from "@/middlewares/exceptionHandle.js";
import httpRequestLogger from "@/middlewares/httpRequestLogge.js";
import sessionMiddleware from "@/middlewares/sessionMiddleware.js";
import rateLimiter from "@/middlewares/rateLimiter.js";
import trimStrings from "@/middlewares/trimStrings.js";
import csrfMiddleware from "@/middlewares/csrfMiddleware.js";

import AuthRoutes from "@/routes/authRoutes.js";

export default class Server {
  constructor(public app: Express = express()) {
    this.mongo();
    this.config();
    this.routes();

    // Add the exception handler middleware after all routes
    // It’s important to ensure that Express catches all errors
    // that occur while running route handlers and middleware.
    this.app.use(exceptionHandler);
  }

  private mongo() {
    const mongooseUri = env.MONGODB_URI;
    if (!mongooseUri) {
      throw new Error("MONGODB_URI is not set in environment variables");
    }

    const connection = mongoose.connection;

    connection
      .on("connected", () => logger.info("Mongo Connection Established"))
      .on("reconnected", () => logger.info("Mongo Connection Reestablished"))
      .on("close", () => logger.info("Mongo Connection Closed"))
      .on("error", (error: Error) =>
        logger.error("Mongo Connection ERROR: " + error),
      );

    mongoose.connect(mongooseUri);
  }

  private config(): void {
    new PassportHandler().initialize();

    this.app
      .set("port", env.PORT)
      .use(helmet())
      .disable("x-powered-by")
      .use(cookieParser())
      .use(httpRequestLogger)
      .use(json())
      .use(urlencoded({ extended: true }))
      .use(trimStrings)
      .use(compression())
      .use(cors(corsOptions))
      .use(sessionMiddleware)
      .use(passport.initialize())
      .use(passport.session())
      .use(rateLimiter())
      .use(csrfMiddleware);
  }

  private routes(): void {
    this.app.use("/auth/", new AuthRoutes().router);
  }

  public start(): void {
    this.app.listen(this.app.get("port"), () => {
      logger.info(`api running on ${this.app.get("port")}`);
    });
  }
}
