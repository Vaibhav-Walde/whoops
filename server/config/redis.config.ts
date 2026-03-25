import Redis from "ioredis";
import { REDIS_URL } from "./constants.config";

const redis = new Redis(REDIS_URL || "redis://127.0.0.1:6379");

export default redis;
