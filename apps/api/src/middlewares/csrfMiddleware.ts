import { NextFunction, Request, Response } from "express";
import { randomBytes } from "crypto";

import { ForbiddenException } from "@/exceptions/httpExceptions.js";

import env from "@/config/envConfig.js";

// List of routes to ignore CSRF check
const ignoreCSRF: (RegExp | string)[] = [/^\/auth/];

export default function csrfMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (!req.session) {
    return next(
      new Error("Session middleware is required before CSRF middleware"),
    );
  }

  // Generate CSRF token if not present in session
  if (!req.session.csrfToken) {
    req.session.csrfToken = randomBytes(24).toString("hex");
  }

  // Set the CSRF token in response headers for every request
  res.cookie("xsrf-token", req.session.csrfToken, {
    httpOnly: false, // Allow frontend to read it
    secure: env.NODE_ENV === "production", // Use HTTPS in production
    sameSite: "strict", // Prevent cross-origin requests
  });

  // Skip CSRF validation if the route is in the ignore list
  const isIgnoredRoute = ignoreCSRF.some((item) =>
    typeof item === "string" ? item === req.path : item.test(req.path),
  );

  // Perform CSRF validation for specific methods if not an ignored route
  if (!isIgnoredRoute) {
    const csrfToken = req.headers["x-csrf-token"];

    if (csrfToken !== req.session.csrfToken) {
      return next(new ForbiddenException("Invalid CSRF token"));
    }
  }

  next();
}
