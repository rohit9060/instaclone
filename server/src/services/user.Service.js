import { User } from "../models/index.js";

import {
  env,
  generateOTP,
  hashUtils,
  tokenUtils,
  EmailSchema,
  SignInSchema,
  UserSchema,
  ResetPasswordSchema,
  OtpSchema,
  ChangePasswordSchema,
  cloudinaryService,
} from "../utils/index.js";

class UserService {
  // sign up
  signUp = async (body) => {
    // validate request
    const { data, error, success } = UserSchema.safeParse(body);
    if (!success) {
      return {
        statusCode: 400,
        success: false,
        message: error.issues[0].message,
      };
    }

    // check if user already exists
    const exists = await User.findOne({
      $or: [{ username: data.username }, { email: data.email }],
    });

    if (exists) {
      return {
        statusCode: 400,
        success: false,
        message: "email or username already exists",
      };
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

    //Todo: send email

    return {
      token,
      statusCode: 201,
      success: true,
      data: user,
      message: "account created successfully",
    };
  };

  // send email verification
  sendEmailVerification = async (body) => {
    // validate request
    const { data, error, success } = EmailSchema.safeParse(body);
    if (!success) {
      return {
        statusCode: 400,
        success: false,
        message: error.issues[0].message,
      };
    }

    // find user
    const user = await User.findOne({ email: data.email });

    if (!user) {
      return {
        statusCode: 404,
        success: false,
        message: "account not found",
      };
    }

    // check if user is verified
    if (user.isVerified) {
      return {
        statusCode: 400,
        success: false,
        message: "account already verified",
      };
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

    return {
      statusCode: 200,
      success: true,
      data: user,
      message: "otp sent successfully",
    };
  };

  // verify email
  verifyEmail = async (body) => {
    // validate request
    const { data, error, success } = OtpSchema.safeParse(body);
    if (!success) {
      return {
        statusCode: 400,
        success: false,
        message: error.issues[0].message,
      };
    }

    // find user
    const user = await User.findById(req.decodeData.id).select("otp");

    if (!user) {
      return {
        statusCode: 404,
        success: false,
        message: "account not found",
      };
    }

    // compare otp
    if (user.otp !== data.otp) {
      return {
        statusCode: 400,
        success: false,
        message: "invalid otp",
      };
    }

    // update user
    user.isVerified = true;
    user.otp = null;

    // save user
    await user.save({ validateBeforeSave: false });

    return {
      statusCode: 200,
      success: true,
      message: "account verified successfully",
    };
  };

  // sign in
  signIn = async (body) => {
    // validate request
    const { data, error, success } = SignInSchema.safeParse(body);
    if (!success) {
      return {
        statusCode: 400,
        success: false,
        message: error.issues[0].message,
      };
    }

    // find user
    const user = await User.findOne({ username: data.username }).select(
      "password username isVerified"
    );

    if (!user) {
      return {
        statusCode: 404,
        success: false,
        message: "account not found",
      };
    }

    // compare password
    const isPasswordCorrect = await hashUtils.verifyBcryptHash(
      data.password,
      user.password
    );

    if (!isPasswordCorrect) {
      return {
        statusCode: 400,
        success: false,
        message: "invalid password",
      };
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

    return {
      statusCode: 200,
      success: true,
      message: "signed in successfully",
      data: {
        accessToken,
        refreshToken,
        user: {
          id: user._id,
          username: user.username,
          isVerified: user.isVerified,
        },
      },
    };
  };

  // sign out
  signOut = async (body) => {};

  // profile
  profile = async (id) => {
    const user = await User.findById(id);

    if (!user) {
      return {
        statusCode: 404,
        success: false,
        message: "account not found",
      };
    }

    return {
      statusCode: 200,
      success: true,
      data: user,
      message: "profile fetched successfully",
    };
  };

  // forgot password
  forgotPassword = async (body) => {
    // validate request
    const { data, error, success } = EmailSchema.safeParse(body);
    if (!success) {
      return {
        statusCode: 400,
        success: false,
        message: error.issues[0].message,
      };
    }

    // find user
    const user = await User.findOne({ email: data.email });

    if (!user) {
      return {
        statusCode: 404,
        success: false,
        message: "account not found",
      };
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

    return {
      statusCode: 200,
      success: true,
      message: "please check your email",
      data: {
        token,
      },
    };
  };

  // reset password
  resetPassword = async (body) => {
    // validate request
    const { data, error, success } = ResetPasswordSchema.safeParse(body);
    if (!success) {
      return {
        statusCode: 400,
        success: false,
        message: error.issues[0].message,
      };
    }

    // find user
    const user = await User.findById(req.decodeData.id).select("otp");

    if (!user) {
      return {
        statusCode: 404,
        success: false,
        message: "account not found",
      };
    }

    // compare otp
    if (user.otp !== data.otp) {
      return {
        statusCode: 400,
        success: false,
        message: "invalid otp",
      };
    }

    // hash password
    const HashPassword = await hashUtils.createBcryptHash(data.password);

    // update password
    user.password = HashPassword;
    user.otp = null;
    user.token = null;

    // save user
    await user.save({ validateBeforeSave: false });

    return {
      statusCode: 200,
      success: true,
      message: "password reset successfully",
    };
  };

  // change password
  changePassword = async (body, id) => {
    // validate request
    const { data, error, success } = ChangePasswordSchema.safeParse(body);
    if (!success) {
      return {
        statusCode: 400,
        success: false,
        message: error.issues[0].message,
      };
    }

    // find user
    const user = await User.findById(id).select("token");

    if (!user) {
      return {
        statusCode: 404,
        success: false,
        message: "account not found",
      };
    }

    // hash password
    const HashPassword = await hashUtils.createBcryptHash(data.password);

    // update password
    user.password = HashPassword;
    user.token = null;

    // save user
    await user.save({ validateBeforeSave: false });

    return {
      statusCode: 200,
      success: true,
      message: "password changed successfully",
    };
  };

  // get User
  getUserByUsername = async (username) => {
    if (!username) {
      return {
        statusCode: 400,
        success: false,
        message: "username is required",
      };
    }

    // find user
    const user = await User.findOne({ username });

    if (!user) {
      return {
        statusCode: 404,
        success: false,
        message: "account not found",
      };
    }

    return {
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
    };
  };

  // upload profile picture
  uploadProfilePicture = async (id, files) => {
    // user
    const user = await User.findById(id);

    if (!user) {
      return {
        statusCode: 404,
        success: false,
        message: "account not found",
      };
    }

    const { public_id, secure_url } = await cloudinaryService.uploadSingleImage(
      files.images[0],
      user.id + "/profile"
    );

    const userUpdated = await User.findByIdAndUpdate(
      id,
      {
        profilePicture: {
          url: secure_url,
          key: public_id,
        },
      },
      { new: true }
    );

    return {
      statusCode: 200,
      success: true,
      message: "profile picture uploaded successfully",
      data: {
        id: userUpdated._id,
        profilePicture: userUpdated.profilePicture,
      },
    };
  };

  // edit profile

  // delete account
}

export const userService = new UserService();
