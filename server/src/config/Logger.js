import { Logger } from "@rohit2005/logger";
import { env } from "./Env.js";

// logger
export const logger = new Logger({
  logFiles: env.NODE_ENV === "production" ? true : false,
});
