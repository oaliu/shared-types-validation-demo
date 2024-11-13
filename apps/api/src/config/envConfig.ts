import dotenv from "dotenv";
import { cleanEnv, url, num, port, str } from "envalid";

dotenv.config();

const env = cleanEnv(process.env, {
  NODE_ENV: str({
    default: "development",
    choices: ["development", "production", "test"],
  }),

  APP_NAME: str({ default: "API" }),
  APP_URL: url({ default: "http://localhost:3000" }),

  PORT: port({ default: 3001 }),

  MONGODB_URI: str({ default: "mongodb://localhost:27017/test" }),
  MONGODB_CONNECT_TIMEOUT_MS: num({ default: 30000 }),
  MONGODB_SOCKET_TIMEOUT_MS: num({ default: 30000 }),

  SESSION_SECRET: str(),
  SESSION_COOKIE_NAME: str(),

  EMAIL_HOST: str(),
  EMAIL_PORT: num(),
  EMAIL_USER: str(),
  EMAIL_PASS: str(),
  EMAIL_FROM: str(),

  CORS_ALLOWED_ORIGINS: str({
    default: "http://localhost:3000",
    example: "http://localhost:3000, http://localhost:5173",
  }),

  LOG_LEVEL: str({
    default: "debug",
    choices: ["debug", "info", "warn", "error"],
  }),
});

export default env;
