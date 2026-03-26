import dotenv from "dotenv";
import type { StringValue } from "ms";
dotenv.config({ override: false });

const NODE_ENV = process.env.NODE_ENV || "development";
const PORT = Number(process.env.PORT) || 8000;
const FRONTEND_URL = process.env.FRONTEND_URL;
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(",").map((o) => o.trim()) ?? ["http://localhost:3000"];
const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRY_TIME: StringValue = (process.env.JWT_EXPIRY_TIME || "7d") as StringValue;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const REDIS_URL = process.env.REDIS_URL;

export {
  NODE_ENV,
  PORT,
  FRONTEND_URL,
  ALLOWED_ORIGINS,
  JWT_SECRET,
  JWT_EXPIRY_TIME,
  REDIS_URL,
  RESEND_API_KEY,
};