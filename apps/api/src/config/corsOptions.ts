import { CorsOptions } from "cors";
import { UnauthorizedException } from "@/exceptions/httpExceptions.js";
import env from "@/config/envConfig.js";

// List of allowed origins
const allowedOrigins = env.CORS_ALLOWED_ORIGINS.split(",").filter(
  Boolean,
) as string[];

// List of allowed methods
const allowedMethods: string[] = [
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
  "OPTIONS",
];

const getCorsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Deny requests with origins not in the allowed list
    if (allowedOrigins.includes(origin || "")) {
      callback(null, true);
    } else {
      callback(new UnauthorizedException("Not allowed by CORS"));
    }
  },
  methods: allowedMethods,
  credentials: true,
  allowedHeaders: ["Content-Type", "x-csrf-token"],
};

export default getCorsOptions;
