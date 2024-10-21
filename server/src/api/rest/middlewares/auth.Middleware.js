import {
  env,
  AsyncErrorHandler,
  HttpError,
  tokenUtils,
} from "../../../utils/index.js";

export const AuthMiddleware = AsyncErrorHandler(async (req, _, next) => {
  // get token from header and cookies
  const token =
    req.headers.authorization?.split(" ")[1] || req.cookies.accessToken;

  if (!token) {
    return next(new HttpError("unauthorized", 401));
  }

  // verify token
  const decodedToken = await tokenUtils.verifyJwtToken(
    token,
    env.ACCESS_TOKEN_SECRET
  );

  if (!decodedToken) {
    return next(new HttpError("unauthorized", 401));
  }

  req.user = decodedToken;
  next();
});
