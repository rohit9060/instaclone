import { env } from "../config/index.js";
import { User } from "../models/index.js";

import {
  generateOTP,
  hashUtils,
  tokenUtils,
  UserSchema,
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
}

export const userService = new UserService();
