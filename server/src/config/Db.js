import mongoose from "mongoose";
import { env } from "./Env.js";
import { logger } from "./Logger.js";
import cache from "express-redis-cache";

const connectDB = async () => {
  try {
    await mongoose.connect(env.DATABASE_URL);
    logger.info("Connected to database");
  } catch (err) {
    logger.error("Error connecting to database");
    console.log(err);
  }
};

const redisCache = cache({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  keyPrefix: "instaclone:",
  expire: 60 * 60,
});

export { connectDB, redisCache };
