import { env } from "../../../config/index.js";
import {
  AsyncErrorHandler,
  HttpError,
  tokenUtils,
} from "../../../utils/index.js";

export const TokenMiddleware = AsyncErrorHandler(async (req, _, next) => {
  // get token from header
  const token = req.headers.authorization?.split(" ")[1] || req.cookies.token;

  if (!token) {
    return next(new HttpError("unauthorized - no token", 401));
  }

  // verify token
  const decodedToken = await tokenUtils.verifyJwtToken(token, env.TOKEN_SECRET);

  if (!decodedToken) {
    return next(new HttpError("unauthorized - invalid token", 401));
  }

  req.decodeData = {
    ...decodedToken,
    token,
  };
  next();
});
