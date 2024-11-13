import { Document, Schema, Model, model, Error } from "mongoose";
import bcrypt from "bcrypt";

import { IUser, TWithoutTimestamps } from "@repo/shared";

interface IUserDocument extends TWithoutTimestamps<IUser> {
  password: string;
  isVerified: boolean;
  verificationToken: string | null;
  passwordResetToken: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserModel extends IUserDocument, Document {
  comparePassword(
    candidatePassword: string,
    callback: (err: Error | undefined, same: boolean) => void,
  ): void;
}

export const userSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true, lowercase: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String, default: null },
    passwordResetToken: { type: String, default: null },
  },
  {
    timestamps: true,
  },
);

userSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.password;
    delete ret.verificationToken;
    delete ret.passwordResetToken;
    return ret;
  },
});

userSchema.pre<IUserModel>("save", function save(next) {
  const user = this;

  if (!user.isModified("password")) {
    return next();
  }

  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }

    bcrypt.hash(
      user.password,
      salt,
      (err: Error | undefined, encrypted: string) => {
        if (err) {
          return next(err);
        }

        user.password = encrypted;
        next();
      },
    );
  });
});

userSchema.methods.comparePassword = function (
  candidatePassword: string,
  callback: (err: Error | undefined, same: boolean) => void,
) {
  bcrypt.compare(candidatePassword, this.password, callback);
};

export const User: Model<IUserModel> = model<IUserModel>("User", userSchema);
