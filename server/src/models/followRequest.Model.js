import { Schema, model } from "mongoose";

const FollowRequestSchema = new Schema({
  sender: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  receiver: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const FollowRequest = model("FollowRequest", FollowRequestSchema);
export { FollowRequest };
