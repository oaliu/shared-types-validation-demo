import { Router } from "express";

import UserSignInRequest from "@/validators/userSignInRequest.js";
import UserSignUpRequest from "@/validators/userSignUpRequest.js";
import ForgotPasswordRequest from "@/validators/forgotPasswordRequest.js";
import ResetPasswordRequest from "@/validators/resetPasswordRequest.js";

import isGuest from "@/middlewares/isGuest.js";

import AuthController from "@/controllers/authController.js";

export default class AuthRoutes {
  constructor(public router: Router = Router()) {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get("/", (req, res) => {
      res.send({
        data: req.user,
      });
    });

    this.router.post(
      "/sign-up",
      isGuest,
      new UserSignUpRequest().validate,
      new AuthController().signUp,
    );

    this.router.post(
      "/sign-in",
      isGuest,
      new UserSignInRequest().validate,
      new AuthController().signIn,
    );

    this.router.post("/sign-out", new AuthController().signOut);

    this.router.post(
      "/send-verification-email",
      new AuthController().resendVerifyEmail,
    );

    this.router.post("/verify-email", new AuthController().verifyEmail);

    this.router.post(
      "/send-password-reset-email",
      new ForgotPasswordRequest().validate,
      new AuthController().sendPasswordResetEmail,
    );

    this.router.post(
      "/reset-password",
      new ResetPasswordRequest().validate,
      new AuthController().resetPassword,
    );
  }
}
