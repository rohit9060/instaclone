import mongoose, { Schema, model } from "mongoose";

const ReelSchema = new Schema(
  {
    caption: {
      type: String,
      default: null,
    },
    media: {
      url: {
        type: String,
        default: null,
      },
      key: {
        type: String,
        default: null,
      },
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    hashTags: [
      {
        type: Schema.Types.ObjectId,
        ref: "HashTag",
      },
    ],
  },
  { timestamps: true }
);

const Reel = model("Reel", ReelSchema);
export { Reel };
