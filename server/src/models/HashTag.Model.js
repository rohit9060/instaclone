import mongoose, { Schema, model } from "mongoose";

const HashTagSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
  },
  { timestamps: true }
);

const HashTag = model("HashTag", HashTagSchema);
export { HashTag };
