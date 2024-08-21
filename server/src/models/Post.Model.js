import { Schema, model } from "mongoose";

const PostSchema = new Schema(
  {
    caption: {
      type: String,
      default: null,
    },
    media: [
      {
        url: {
          type: String,
          default: null,
        },
        key: {
          type: String,
          default: null,
        },
      },
    ],
    music: {
      title: {
        type: String,
        trim: true,
      },
      artist: {
        type: String,
        trim: true,
      },
      url: {
        type: String,
        trim: true,
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
    tagUsers: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
  },
  { timestamps: true }
);

const Post = model("Post", PostSchema);
export { Post };
