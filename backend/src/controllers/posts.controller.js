import { Post } from "../models/posts.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import uploadToCloudinary from "../utils/cloudinary.js";
import { isValidObjectId } from "mongoose";

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
    featuredImage: cloudinaryFeautredImage
      ? cloudinaryFeautredImage
      : undefined,
  });

  if (!publishedPost) {
    throw new ApiError(500, "Something went wrong! Please try again");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, "Post published successfully", publishPost));
});

// Controller: Get all the Posts
const getAllPosts = asyncHandler(async (req, res) => {
    //
})

export { publishPost, getAllPosts};
