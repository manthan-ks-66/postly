import { Post } from "../models/posts.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import uploadToCloudinary from "../utils/cloudinary.js";
import { isValidObjectId } from "mongoose";
import { PostLike } from "../models/postLikes.model.js";

// Controller: Upload post
const publishPost = asyncHandler(async (req, res) => {
  const { title, slug, content, category } = req.body;

  const userId = req.user?._id;

  if ([title, slug, content, category].some((field) => !field)) {
    throw new ApiError(400, "All fields are required!");
  }

  if (!userId || !isValidObjectId(userId)) {
    throw new ApiError(400, "User Unauthenticated");
  }

  let cloudinaryFeautredImage = null;

  const featuredImagePath = req.file?.path;

  if (featuredImagePath) {
    cloudinaryFeautredImage = await uploadToCloudinary(featuredImagePath);

    if (!cloudinaryFeautredImage) {
      throw new ApiError(500, "Image upload failed!");
    }
  }

  const publishedPost = await Post.create({
    title,
    slug,
    content,
    category,
    userId,
    featuredImage: cloudinaryFeautredImage?.url,
  });

  if (!publishedPost) {
    throw new ApiError(500, "Something went wrong");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, "Post published successfully", publishedPost));
});

// Controller: Update the post
const updatePost = asyncHandler(async (req, res) => {
  //
});

// Controller: Get all the Posts
const getAllPosts = asyncHandler(async (req, res) => {
  //
});

// Controller: Toggle Post like
const togglePostLike = asyncHandler(async (req, res) => {

  const { postId } = req.body;

  const likedBy = req.user?._id;

  if (!isValidObjectId(likedBy) || !isValidObjectId(postId)) {
    throw new ApiError(400, "Invalid user id or post id");
  }

  let post = await Post.findById(postId);

  if (!post) {
    throw new ApiError(400, "Cannot find the post");
  }

  const existingPostLike = await PostLike.findOne({ likedBy, postId });

  if (existingPostLike) {
    await PostLike.findByIdAndDelete(existingPostLike._id);
    await Post.updateOne({ _id: postId }, { $inc: { likesCount: -1 } });

    post = await Post.findById(post._id);
  } else {
    await PostLike.create({
      postId,
      likedBy,
    });

    await Post.updateOne({ _id: postId }, { $inc: { likesCount: 1 } });

    post = await Post.findById(post._id);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "post like toggled successfully", post));
});

// Controller: Get user liked posts

export { publishPost, getAllPosts, updatePost, togglePostLike };
