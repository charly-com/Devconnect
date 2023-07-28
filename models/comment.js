import mongoose from "mongoose";
const { Schema } = mongoose;

const commentSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    tag: Object,
    reply: mongoose.Types.ObjectId,
    likes: [{ type: mongoose.Types.ObjectId, ref: "User" }],
    user: { type: mongoose.Types.ObjectId, ref: "User" },
    postId: mongoose.Types.ObjectId,
    postUserId: mongoose.Types.ObjectId,
  },
  {
    timestamps: true,
  }
);

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;