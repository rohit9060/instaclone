import { env } from "../config/index.js";
import { User } from "../models/index.js";
import { SignInSchema, UserSchema } from "../schema/index.js";
import {
  AsyncErrorHandler,
  HttpError,
  generateOTP,
  hashUtils,
  tokenUtils,
} from "../utils/index.js";

class UserController {
  // sign up
  signUp = AsyncErrorHandler(async (req, res, next) => {
    // validate request
    const { data, error, success } = UserSchema.safeParse(req.body);
    if (!success) {
      return next(new HttpError(error.issues[0].message, 400));
    }

    // check if user already exists
    const exists = await User.findOne({
      $or: [{ username: data.username }, { email: data.email }],
    });

    if (exists) {
      return next(new HttpError("Email or username already exists", 400));
    }

    // hash password
    const HashPassword = await hashUtils.createBcryptHash(data.password);

    // create user
    const user = new User({
      firstName: data.firstName,
      lastName: data.lastName,
      username: data.username,
      email: data.email,
      password: HashPassword,
      phone: data.phone,
      bio: data.bio,
      gender: data.gender,
    });

    // gen otp
    const otp = await generateOTP();

    // generate token
    const token = await tokenUtils.createJwtToken(
      { id: user._id },
      env.TOKEN_SECRET,
      "1d"
    );

    // add token and otp to user
    user.token = token;
    user.otp = otp;

    // save user
    await user.save({ validateBeforeSave: false });

    // http only cookies
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24 * 1,
    });

    return res.status(200).json({
      statusCode: 201,
      success: true,
      data: user,
    });
  });

  // sign in
  signIn = AsyncErrorHandler(async (req, res, next) => {
    // validate request
    const { data, error, success } = SignInSchema.safeParse(req.body);
    if (!success) {
      return next(new HttpError(error.issues[0].message, 400));
    }

    // find user
    const user = await User.findOne({ username: data.username });

    if (!user) {
      return next(new HttpError("Account not found", 400));
    }

    // compare password
    const isPasswordCorrect = await hashUtils.verifyBcryptHash(
      data.password,
      user.password
    );

    if (!isPasswordCorrect) {
      return next(new HttpError("Invalid credentials", 400));
    }

    // if (!user.isVerified) {
    //   return next(new HttpError("Please verify your account", 400));
    // }

    // generate token
    const accessToken = await tokenUtils.createJwtToken(
      { id: user._id, role: user.role },
      env.ACCESS_TOKEN_SECRET,
      "1d"
    );
    const refreshToken = await tokenUtils.createJwtToken(
      { id: user._id },
      env.REFRESH_TOKEN_SECRET,
      "1d"
    );

    // add token and otp to user
    user.token = refreshToken;

    // save user
    await user.save({ validateBeforeSave: false });

    // http only cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24 * 1,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return res.status(200).json({
      statusCode: 200,
      success: true,
      data: {
        accessToken,
        refreshToken,
      },
    });
  });
}

export const userController = new UserController();
