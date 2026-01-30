import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    content: {
      time: {
        type: Number,
      },
      blocks: {
        type: Array,
      },
      version: {
        type: String,
      },
    },
    featuredImage: {
      type: String,
      default: undefined,
    },
    category: {
      type: String,
      required: true,
      enum: ["Tech", "Story", "Business", "Education"],
    },
    likesCount: {
      type: Number,
      default: 0,
    },
    commentsCount: {
      type: Number,
      default: 0,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    editedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

export const Post = mongoose.model("Post", postSchema);
