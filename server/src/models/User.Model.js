import { Schema, model } from "mongoose";

const UserSchema = new Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      select: false,
    },
    phone: {
      type: String,
      default: null,
    },
    profilePicture: {
      url: {
        type: String,
        default: null,
      },
      key: {
        type: String,
        default: null,
      },
    },
    bio: {
      type: String,
      default: null,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    closeFriends: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    stories: [
      {
        type: Schema.Types.ObjectId,
        ref: "Story",
      },
    ],
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    reels: [
      {
        type: Schema.Types.ObjectId,
        ref: "Reel",
      },
    ],
    savedPosts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    savedStories: [
      {
        type: Schema.Types.ObjectId,
        ref: "Story",
      },
    ],
    savedReels: [
      {
        type: Schema.Types.ObjectId,
        ref: "Reel",
      },
    ],
    AccountType: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
    ApprovedUser: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    followRequests: [
      {
        type: Schema.Types.ObjectId,
        ref: "FollowRequest",
      },
    ],
    webLinks: [
      {
        type: String,
        trim: true,
      },
    ],
    otp: {
      type: String,
      default: null,
      select: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    token: {
      type: String,
      default: null,
      select: false,
    },
  },
  { timestamps: true }
);

const User = model("User", UserSchema);
export { User };
