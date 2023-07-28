import mongoose from "mongoose";

const postSchema = mongoose.Schema(
  {
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    
    location: String,
    description: String,
    picturePath: String,
  
    likes: [
        {
          type: mongoose.Types.ObjectId,
          ref: "User",
        },
      ],
    comments: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Comment",
      },
    ],
    reports: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
