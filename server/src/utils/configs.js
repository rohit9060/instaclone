import mongoose from "mongoose";
import cache from "express-redis-cache";
import { Logger } from "@rohit2005/logger";
import dotenv from "dotenv";
dotenv.config();

const _env = {
  PORT: process.env.PORT,
  GRAPH_PORT: process.env.GRAPH_PORT,
  NODE_ENV: process.env.NODE_ENV,

  DATABASE_URL: process.env.DATABASE_URL,
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: process.env.REDIS_PORT,

  TOKEN_SECRET: process.env.TOKEN_SECRET,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,

  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
};

// env object
const env = Object.freeze(_env);

// logger
export const logger = new Logger({
  logFiles: env.NODE_ENV === "production" ? true : false,
});

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

export { connectDB, redisCache, env };
