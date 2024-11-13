import { randomBytes } from "crypto";

import { IUserModel, User } from "@/models/user.js";
import MailerService from "@/services/MailerService.js";
import { NotFoundException } from "@/exceptions/httpExceptions.js";

import env from "@/config/envConfig.js";

export default class UserService {
  public create({
    name,
    email,
    password,
  }: {
    name: string;
    email: string;
    password: string;
  }): Promise<IUserModel> {
    return User.create({ name, email, password });
  }

  public async sendVerificationEmail(user: IUserModel): Promise<void> {
    const verificationToken = randomBytes(32).toString("hex");

    user.verificationToken = verificationToken;
    await user.save();

    const { name, email } = user;

    const url = `${env.APP_URL}/verify-email/${verificationToken}`;

    MailerService.sendMail({
      to: email,
      subject: "Email verification",
      template: "email-verification",
      context: {
        name,
        url,
        appName: env.APP_NAME,
      },
    });
  }

  public async verifyEmail(verificationToken: string): Promise<IUserModel> {
    const user = await User.findOne({ verificationToken });

    if (!user) {
      throw new NotFoundException("Invalid verification token");
    }

    user.verificationToken = null;
    user.isVerified = true;
    await user.save();

    return user;
  }

  public async sendPasswordResetEmail(email: string): Promise<void> {
    const user = await User.findOne({ email });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const resetToken = randomBytes(32).toString("hex");

    user.passwordResetToken = resetToken;
    await user.save();

    const url = `${env.APP_URL}/reset-password/${resetToken}`;

    MailerService.sendMail({
      to: email,
      subject: "Password reset",
      template: "password-reset",
      context: {
        name: user.name,
        url,
        appName: env.APP_NAME,
      },
    });
  }

  public async resetPassword({
    token,
    password,
  }: {
    token: string;
    password: string;
  }): Promise<IUserModel> {
    const user = await User.findOne({ passwordResetToken: token });

    if (!user) {
      throw new NotFoundException("Invalid reset token");
    }

    user.password = password;
    user.passwordResetToken = null;
    await user.save();

    return user;
  }
}
