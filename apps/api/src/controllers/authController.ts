import { NextFunction, Request, Response } from "express";
import passport from "passport";
import passportLocal from "passport-local";

import { IUserModel } from "@/models/user.js";
import { NotFoundException } from "@/exceptions/httpExceptions.js";

import UserService from "@/services/UserService.js";
import AuthService from "@/services/AuthService.js";

export default class AuthController {
  public constructor(
    private userService: UserService = new UserService(),
    private authService: AuthService = new AuthService(),
  ) {}

  public signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.create(req.body);
      this.userService.sendVerificationEmail(user);

      this.authService.login(req, user, (err) => {
        if (err) return next(err);
        res.send({ message: "User signed up successfully", data: user });
      });
    } catch (error) {
      next(error);
    }
  };

  public signIn = async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(
      "local",
      (
        err: Error | undefined,
        user: IUserModel | undefined,
        info: passportLocal.IVerifyOptions,
      ) => {
        if (err) return next(err);

        if (!user) {
          next(new NotFoundException(info.message));
        } else {
          this.authService.login(req, user, (err) => {
            if (err) return next(err);
            res.send({ data: user });
          });
        }
      },
    )(req, res, next);
  };

  public signOut = (req: Request, res: Response, next: NextFunction) => {
    this.authService.logout(req, res, (err) => {
      if (err) return next(err);

      res.send({ message: "Signed out successfully" });
    });
  };

  public verifyEmail = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      await this.userService.verifyEmail(req.body.token || "");
      res.send({ message: "Email verified successfully" });
    } catch (error) {
      next(error);
    }
  };

  public resendVerifyEmail = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    if (!req.user || req.user.isVerified) {
      next(new NotFoundException("User not found"));
    }

    try {
      await this.userService.sendVerificationEmail(req.user as IUserModel);
      res.send({ message: "Verification email sent successfully" });
    } catch (error) {
      next(error);
    }
  };

  public sendPasswordResetEmail = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      await this.userService.sendPasswordResetEmail(req.body.email);
      res.send({ message: "Password reset email sent successfully" });
    } catch (error) {
      next(error);
    }
  };

  public resetPassword = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      await this.userService.resetPassword(req.body);
      res.send({ message: "Password reset successfully" });
    } catch (error) {
      next(error);
    }
  };
}
