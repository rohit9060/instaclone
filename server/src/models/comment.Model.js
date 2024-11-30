import { Schema, model } from "mongoose";

const CommentSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
    reel: {
      type: Schema.Types.ObjectId,
      ref: "Reel",
    },
  },
  { timestamps: true }
);

const Comment = model("Comment", CommentSchema);
export { Comment };
