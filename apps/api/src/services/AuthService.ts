import { Request, Response } from "express";
import { randomBytes } from "crypto";

import { IUserModel } from "@/models/user.js";

import env from "@/config/envConfig.js";

export default class AuthService {
  public login(
    req: Request,
    user: IUserModel,
    callback: (err: Error | undefined) => void,
  ) {
    req.logIn(user, (err) => {
      if (err) {
        return callback(err);
      }

      const csrfToken = randomBytes(24).toString("hex");

      req.session.csrfToken = csrfToken;

      callback(undefined);
    });
  }

  public logout(
    req: Request,
    res: Response,
    callback: (err: Error | undefined) => void,
  ) {
    req.logout((err) => {
      if (err) return callback(err);

      req.session.destroy((destroyErr) => {
        if (destroyErr) return callback(destroyErr);

        res.clearCookie(env.SESSION_COOKIE_NAME);

        callback(undefined);
      });
    });
  }
}
