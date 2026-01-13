import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({
  commentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment",
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
  },
  likedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

export const Like = mongoose.model("Like", likeSchema);
