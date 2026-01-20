import mongoose from "mongoose";

const postLikesSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
    likedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

postLikesSchema.index({ postId: 1, likedBy: 1 }, { unique: true });

export const PostLike = mongoose.model("Postlike", postLikesSchema);
