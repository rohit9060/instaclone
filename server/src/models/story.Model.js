import { Schema, model } from "mongoose";

const StorySchema = new Schema(
  {
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
    views: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    mentions: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
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
    type: {
      type: String,
      enum: ["public", "followers", "closeFriends"],
    },
  },
  { timestamps: true }
);

const Story = model("Story", StorySchema);
export { Story };
