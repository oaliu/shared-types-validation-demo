import { RequestHandler } from "express";
import session from "express-session";
import MongoStore from "connect-mongo";

import env from "@/config/envConfig.js";

// Initialize the session middleware once
const sessionMiddleware = session({
  name: env.SESSION_COOKIE_NAME,
  secret: env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: env.MONGODB_URI }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 }, // 7 days
});

const sessionHandler: RequestHandler = (req, res, next) => {
  // Use the already initialized session middleware
  sessionMiddleware(req, res, next);
};

export default sessionHandler;
