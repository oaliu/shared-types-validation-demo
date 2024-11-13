import { IUserModel } from "@/models/user.js";

declare global {
  namespace Express {
    interface User extends IUserModel {}
  }
}
