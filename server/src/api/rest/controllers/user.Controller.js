import { env } from "../../../config/index.js";
import { User } from "../../../models/index.js";

import {
  AsyncErrorHandler,
  HttpError,
  generateOTP,
  hashUtils,
  tokenUtils,
  EmailSchema,
  SignInSchema,
  UserSchema,
  ResetPasswordSchema,
  OtpSchema,
  ChangePasswordSchema,
} from "../../../utils/index.js";

import { userService } from "../../../services/index.js";

class UserController {
  // sign up
  signUp = AsyncErrorHandler(async (req, res, next) => {
    const { statusCode, success, message, data, token } =
      await userService.signUp(req.body);

    if (statusCode !== 201) {
      return next(new HttpError(message, statusCode));
    }

    // http only cookies
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24 * 1,
    });

    return res.status(statusCode).json({
      statusCode,
      success,
      data,
      message,
    });
  });

  // send email verification
  sendEmailVerification = AsyncErrorHandler(async (req, res, next) => {
    // validate request
    const { data, error, success } = EmailSchema.safeParse(req.body);
    if (!success) {
      return next(new HttpError(error.issues[0].message, 400));
    }

    // find user
    const user = await User.findOne({ email: data.email });

    if (!user) {
      return next(new HttpError("account not found", 404));
    }

    // check if user is verified
    if (user.isVerified) {
      return next(new HttpError("account already verified", 400));
    }

    // generate otp
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

    //TODO: send email

    return res.status(200).json({
      statusCode: 200,
      success: true,
      message: "please check your email",
      data: {
        token,
      },
    });
  });

  // verify email
  verifyEmail = AsyncErrorHandler(async (req, res, next) => {
    // validate request
    const { data, error, success } = OtpSchema.safeParse(req.body);
    if (!success) {
      return next(new HttpError(error.issues[0].message, 400));
    }

    // find user
    const user = await User.findById(req.decodeData.id).select("otp");

    if (!user) {
      return next(new HttpError("account not found", 404));
    }

    // compare otp
    if (user.otp !== data.otp) {
      return next(new HttpError("otp not valid", 400));
    }

    // update user
    user.isVerified = true;
    user.otp = null;

    // save user
    await user.save({ validateBeforeSave: false });

    return res.status(200).json({
      statusCode: 200,
      success: true,
      message: "account verified successfully",
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
    const user = await User.findOne({ username: data.username }).select(
      "password username isVerified"
    );

    if (!user) {
      return next(new HttpError("account not found", 404));
    }

    // compare password
    const isPasswordCorrect = await hashUtils.verifyBcryptHash(
      data.password,
      user.password
    );

    if (!isPasswordCorrect) {
      return next(new HttpError("Invalid credentials", 400));
    }

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
        user: {
          id: user._id,
          username: user.username,
          isVerified: user.isVerified,
        },
      },
      message: "sign in successful",
    });
  });

  // sign out
  signOut = AsyncErrorHandler(async (_, res, __) => {
    res.cookie("accessToken", "", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 1000,
    });

    res.cookie("refreshToken", "", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 1000,
    });

    return res.status(200).json({
      statusCode: 200,
      success: true,
      message: "signed out successfully",
    });
  });

  // get user
  profile = AsyncErrorHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    if (!user) {
      return next(new HttpError("profile not found", 404));
    }

    return res.status(200).json({
      statusCode: 200,
      success: true,
      message: "profile fetched successfully",
      data: user,
    });
  });

  // forgot password
  forgotPassword = AsyncErrorHandler(async (req, res, next) => {
    // validate request
    const { data, error, success } = EmailSchema.safeParse(req.body);
    if (!success) {
      return next(new HttpError(error.issues[0].message, 400));
    }

    // find user
    const user = await User.findOne({ email: data.email });

    if (!user) {
      return next(new HttpError("account not found", 404));
    }

    // generate otp
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

    //TODO: send email

    return res.status(200).json({
      statusCode: 200,
      success: true,
      message: "please check your email",
    });
  });

  // reset password
  resetPassword = AsyncErrorHandler(async (req, res, next) => {
    // validate request
    const { data, error, success } = ResetPasswordSchema.safeParse(req.body);
    if (!success) {
      return next(new HttpError(error.issues[0].message, 400));
    }

    // find user
    const user = await User.findById(req.decodeData.id).select("otp");

    if (!user) {
      return next(new HttpError("account not found", 404));
    }

    // compare otp
    if (user.otp !== data.otp) {
      return next(new HttpError("otp not valid", 400));
    }

    // hash password
    const HashPassword = await hashUtils.createBcryptHash(data.password);

    // update password
    user.password = HashPassword;
    user.otp = null;
    user.token = null;

    // save user
    await user.save({ validateBeforeSave: false });

    // http only cookie
    res.cookie("token", null, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 1,
    });

    return res.status(200).json({
      statusCode: 200,
      success: true,
      message: "password reset successfully",
    });
  });

  // change password
  changePassword = AsyncErrorHandler(async (req, res, next) => {
    // validate request
    const { data, error, success } = ChangePasswordSchema.safeParse(req.body);
    if (!success) {
      return next(new HttpError(error.issues[0].message, 400));
    }

    // find user
    const user = await User.findById(req.decodeData.id).select("token");

    if (!user) {
      return next(new HttpError("account not found", 404));
    }

    // hash password
    const HashPassword = await hashUtils.createBcryptHash(data.password);

    // update password
    user.password = HashPassword;
    user.token = null;

    // save user
    await user.save({ validateBeforeSave: false });

    // http only cookie
    res.cookie("accessToken", null, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 1,
    });

    res.cookie("refreshToken", null, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 1,
    });

    return res.status(200).json({
      statusCode: 200,
      success: true,
      message: "password changed successfully",
    });
  });

  // get user by username
  getUserByUsername = AsyncErrorHandler(async (req, res, next) => {
    const username = req.params.username;
    if (!username) {
      return next(new HttpError("username is required", 400));
    }

    // find user
    const user = await User.findOne({ username });

    if (!user) {
      return next(new HttpError("account not found", 404));
    }

    return res.status(200).json({
      statusCode: 200,
      success: true,
      message: "user fetched successfully",
      data: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        gender: user.gender,
        accountType: user.accountType,
        profilePictureUrl: user.profilePicture.url,
        followingCount: user.following.length,
        followersCount: user.followers.length,
        postCount: user.posts.length,
        reelCount: user.reels.length,
        following: user.accountType === "public" ? user.following : [],
        followers: user.accountType === "public" ? user.followers : [],
        posts: user.accountType === "public" ? user.posts : [],
        reels: user.accountType === "public" ? user.reels : [],
        webLinks: user.accountType === "public" ? user.webLinks : [],
      },
    });
  });

  // upload profile picture

  // edit profile

  // delete account
}
export const userController = new UserController();
