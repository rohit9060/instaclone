import { userService } from "../../../services/index.js";
import { AsyncErrorHandler, HttpError } from "../../../utils/index.js";

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
    const { statusCode, success, message, token } =
      await userService.sendEmailVerification(req.body);

    if (statusCode !== 200) {
      return next(new HttpError(message, statusCode));
    }

    return res.status(statusCode).json({
      statusCode,
      success,
      message,
      data: {
        token,
      },
    });
  });

  // verify email
  verifyEmail = AsyncErrorHandler(async (req, res, next) => {
    const { statusCode, success, message } = await userService.verifyEmail(
      req.body
    );

    if (statusCode !== 200) {
      return next(new HttpError(message, statusCode));
    }

    return res.status(statusCode).json({
      statusCode,
      success,
      message,
    });
  });

  // sign in
  signIn = AsyncErrorHandler(async (req, res, next) => {
    const { statusCode, message, success, data } = await userService.signIn(
      req.body
    );

    if (statusCode !== 200) {
      return next(new HttpError(message, statusCode));
    }

    // http only cookies
    res.cookie("accessToken", data.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24 * 1,
    });

    res.cookie("refreshToken", data.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return res.status(statusCode).json({
      statusCode,
      success,
      data,
      message,
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

  // get Profile
  getProfile = AsyncErrorHandler(async (req, res, next) => {
    console.log("correct");

    const { statusCode, success, message, data } = await userService.getProfile(
      req.user.id
    );

    if (statusCode !== 200) {
      return next(new HttpError(message, statusCode));
    }

    return res.status(statusCode).json({
      statusCode,
      success,
      message,
      data,
    });
  });

  // forgot password
  forgotPassword = AsyncErrorHandler(async (req, res, next) => {
    const { statusCode, success, message, data } =
      await userService.forgotPassword(req.body);

    if (statusCode !== 200) {
      return next(new HttpError(message, statusCode));
    }

    // http only cookie
    res.cookie("token", data.token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24 * 1,
    });

    return res.status(statusCode).json({
      statusCode,
      success,
      message,
    });
  });

  // reset password
  resetPassword = AsyncErrorHandler(async (req, res, next) => {
    const { statusCode, success, message } = await userService.resetPassword(
      req.body
    );

    if (statusCode !== 200) {
      return next(new HttpError(message, statusCode));
    }

    // http only cookie
    res.cookie("token", null, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 1,
    });

    return res.status(statusCode).json({
      statusCode,
      success,
      message,
    });
  });

  // change password
  changePassword = AsyncErrorHandler(async (req, res, next) => {
    const { statusCode, success, message } = await userService.changePassword(
      req.body,
      req.decodeData.id
    );

    if (statusCode !== 200) {
      return next(new HttpError(message, statusCode));
    }

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

    return res.status(statusCode).json({
      statusCode,
      success,
      message,
    });
  });

  // get user by username
  getUserByUsername = AsyncErrorHandler(async (req, res, next) => {
    console.log("wrong");
    const username = req.params.username;

    const { statusCode, success, message, data } =
      await userService.getUserByUsername(username);

    if (statusCode !== 200) {
      return next(new HttpError(message, statusCode));
    }

    return res.status(statusCode).json({
      statusCode,
      success,
      message,
      data,
    });
  });

  // upload profile picture
  uploadProfilePicture = AsyncErrorHandler(async (req, res, next) => {
    if (!req.files) {
      return next(new HttpError("please provide profile picture", 400));
    }

    const { statusCode, success, message, data } =
      await userService.uploadProfilePicture(req.user.id, req.files);

    if (statusCode !== 200) {
      return next(new HttpError(message, statusCode));
    }

    return res.status(statusCode).json({
      statusCode,
      success,
      message,
      data,
    });
  });

  // update profile picture
  updateProfilePicture = AsyncErrorHandler(async (req, res, next) => {});

  // delete profile picture
  deleteProfilePicture = AsyncErrorHandler(async (req, res, next) => {});

  // edit profile
  editProfile = AsyncErrorHandler(async (req, res, next) => {});

  // delete account
  deleteAccount = AsyncErrorHandler(async (req, res, next) => {});
}
export const userController = new UserController();
