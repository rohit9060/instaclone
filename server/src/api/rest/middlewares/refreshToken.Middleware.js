import {
  env,
  AsyncErrorHandler,
  HttpError,
  tokenUtils,
} from "../../../utils/index.js";

export const RefreshTokenMiddleware = AsyncErrorHandler(
  async (req, _, next) => {
    // get token from header
    const token =
      req.headers.authorization?.split(" ")[1] || req.cookies.refreshToken;

    if (!token) {
      return next(new HttpError("unauthorized", 401));
    }

    // verify token
    const decodedToken = await tokenUtils.verifyJwtToken(
      token,
      env.REFRESH_TOKEN_SECRET
    );

    if (!decodedToken) {
      return next(new HttpError("unauthorized", 401));
    }

    req.decodeData = {
      ...decodedToken,
      token,
    };
    next();
  }
);
