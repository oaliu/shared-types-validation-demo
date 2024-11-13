import { User } from "@/models/user.js";
import passport from "passport";
import passportLocal from "passport-local";

const LocalStrategy = passportLocal.Strategy;

export default class PassportHandler {
  public initialize(): void {
    passport.use(this.createLocalStrategy());

    passport.serializeUser((user: any, done) => done(null, user.id));

    passport.deserializeUser(async (id, done) => {
      try {
        const user = await User.findById(id);
        done(null, user);
      } catch (err) {
        done(err);
      }
    });
  }

  private createLocalStrategy(): passportLocal.Strategy {
    return new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          const user = await User.findOne({ email: email.toLowerCase() });
          if (!user) {
            return done(undefined, false, {
              message: "Invalid email or password.",
            });
          }

          user.comparePassword(
            password,
            (err: Error | undefined, isMatch: boolean) => {
              if (err) return done(err);
              if (isMatch) return done(undefined, user);
              done(undefined, false, { message: "Invalid email or password." });
            },
          );
        } catch (error) {
          done(error);
        }
      },
    );
  }
}
