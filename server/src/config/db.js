import mongoose from "mongoose";
import { env } from "./env.js";
import { logger } from "./logger.js";
import cache from "express-redis-cache";

const connectDB = async () => {
  try {
    const con = await mongoose.connect(env.DATABASE_URL);
    logger.info(
      "Connected to database " +
        con.connection.host +
        "->" +
        con.connections[0].name
    );
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
