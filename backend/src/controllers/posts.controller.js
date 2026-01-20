import { Post } from "../models/posts.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import uploadToCloudinary from "../utils/cloudinary.js";
import mongoose, { isValidObjectId, mongo } from "mongoose";
import { PostLike } from "../models/postLikes.model.js";
import formatPost from "../utils/dateFormatter.js";

// Controller: Upload post
const publishPost = asyncHandler(async (req, res) => {
  const { title, slug, content, category } = req.body;

  const userId = req.user?._id;

  let cloudinaryFeautredImage = null;

  const featuredImagePath = req.file?.path;

  if ([title, slug, content, category].some((field) => !field)) {
    throw new ApiError(400, "All fields are required!");
  }

  if (!userId || !isValidObjectId(userId)) {
    throw new ApiError(400, "User Unauthenticated");
  }

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
  const { title, content, slug, category } = req.body;

  const { postId } = req.params;
  const userId = req.user?._id;

  let cloudinaryFeautredImage = null;

  const featuredImagePath = req.file?.path;

  if ([title, slug, content, category].some((field) => !field)) {
    throw new ApiError(400, "Required fields are empty");
  }

  if (!isValidObjectId(userId) || !isValidObjectId(postId)) {
    throw new ApiError(400, "Unauthorized: Invalid user id or post id");
  }

  const post = await Post.findById(postId);

  if (!post) {
    throw new ApiError(400, "No post found!");
  }

  if (!post.userId.equals(userId)) {
    throw new ApiError(400, "Unauthorized: You do not own this post");
  }

  if (featuredImagePath) {
    cloudinaryFeautredImage = await uploadToCloudinary(featuredImagePath);

    if (!cloudinaryFeautredImage) {
      throw new ApiError(500, "Image upload failed!");
    }

    post.featuredImage = cloudinaryFeautredImage?.url;
  }

  post.title = title;
  post.slug = slug;
  post.content = content;
  post.category = category;

  const updatedPost = await post.save({ validateBeforeSave: true });

  if (!updatedPost) {
    throw new ApiError(500, "Something went wrong");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Post updated successfully", updatedPost));
});

// Controller: Get all the Posts (Paginated)
const getAllPosts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 5 } = req.query;

  const totalPosts = await Post.countDocuments();

  const posts = await Post.find({})
    .sort()
    .skip((page - 1) * limit)
    .limit(Number(limit));

  if (posts?.length === 0) {
    throw new ApiError(400, "No posts found");
  }

  const data = {
    posts,
    totalPosts: totalPosts,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, "Posts fetched successfully", data));
});

// Controller: get posts on query
const getQueryPosts = asyncHandler(async (req, res) => {
  const { query, page = 1, limit = 10 } = req.query;

  if (!query) {
    throw new ApiError(400, "Query is required to fetch posts");
  }

  const filter = {
    title: { $regex: query, $options: "i" },
  };

  const posts = await Post.find(filter)
    .sort()
    .skip(page - 1)
    .limit(Number(limit));

  const totalPosts = await Post.countDocuments();

  if (posts.length === 0) {
    throw new ApiError(400, "No such posts found");
  }

  const data = {
    posts,
    totalPosts: totalPosts,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, "Query posts fetched successfully", data));
});

// Controller: Toggle Post like
const togglePostLike = asyncHandler(async (req, res) => {
  const { postId } = req.body;

  const likedBy = req.user?._id;

  if (!isValidObjectId(likedBy) || !isValidObjectId(postId)) {
    throw new ApiError(400, "Invalid user id or post id");
  }

  // check - if post is valid
  const post = await Post.findById(postId);

  if (!post) {
    throw new ApiError(400, "No post found");
  }

  try {
    await PostLike.create({ postId, likedBy });

    await Post.updateOne({ _id: postId }, { $inc: { likesCount: 1 } });

    return res
      .status(200)
      .json(new ApiResponse(200, "Post Liked successfully", {}));
  } catch (error) {
    if (error.code === 11000) {
      await PostLike.deleteOne({ postId, likedBy });

      await Post.updateOne({ _id: postId }, { $inc: { likesCount: -1 } });

      return res
        .status(200)
        .json(new ApiResponse(200, "Post un-liked successfully", {}));
    } else {
      throw error;
    }
  }
});

// Controller: Get one post
const getPost = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  if (!isValidObjectId(postId)) {
    throw new ApiError(400, "Invalid post id");
  }

  const post = await Post.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(postId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "author",
        pipeline: [
          {
            $project: {
              fullName: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: "$author",
    },
    {
      $project: {
        title: 1,
        content: 1,
        userId: 1,
        slug: 1,
        featuredImage: 1,
        createdAt: {
          $dateToString: {
            date: "$createdAt",
            format: "%d %b %Y",
            timezone: "Asia/Kolkata",
          },
        },
        updatedAt: {
          $dateToString: {
            date: "$updatedAt",
            format: "%d %b %Y",
            timezone: "Asia/Kolkata",
          },
        },
        category: 1,
        likesCount: 1,
        commentsCount: 1,
        author: 1,
      },
    },
  ]);

  if (!post) {
    throw new ApiError(400, "No post found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Post fetched successfully", post));
});

// Controller: Get user liked posts
const getUserLikedPosts = asyncHandler(async (req, res) => {
  const likedBy = req.user?._id;

  if (!isValidObjectId(likedBy)) {
    throw new ApiError(400, "Invalid user id");
  }

  // left join of PostLikes (left) with Posts (right) and Posts(array) with Users (right)
  // const userLikedPosts = await PostLike.aggregate([
  //   {
  //     $match: {
  //       likedBy: new mongoose.Types.ObjectId(likedBy),
  //     },
  //   },
  //   {
  //     $lookup: {
  //       from: "posts",
  //       localField: "postId",
  //       foreignField: "_id",
  //       as: "userLikedPosts",
  //       pipeline: [
  //         {
  //           $lookup: {
  //             from: "users",
  //             localField: "userId",
  //             foreignField: "_id",
  //             as: "author",
  //             pipeline: [
  //               {
  //                 $project: {
  //                   username: 1,
  //                   fullName: 1,
  //                   email: 1,
  //                   avatar: 1,
  //                   _id: 1,
  //                 },
  //               },
  //             ],
  //           },
  //         },
  //         {
  //           $unwind: "$author",
  //         },
  //       ],
  //     },
  //   },
  //   {
  //     $unwind: "$userLikedPosts",
  //   },
  //   {
  //     $project: {
  //       _id: "$userLikedPosts._id",
  //       title: "$userLikedPosts.title",
  //       content: "$userLikedPosts.content",
  //       featuredImage: "$userLikedPosts.featuredImage",
  //       category: "$userLikedPosts.category",
  //       likesCount: "$userLikedPosts.likesCount",
  //       commentsCount: "$userLikedPosts.commentsCount",
  //       createdAt: "$userLikedPosts.createdAt",
  //       updatedAt: "$userLikedPosts.updatedAt",
  //       author: "$userLikedPosts.author",
  //     },
  //   },
  // ]);

  const userLikedPosts = await PostLike.aggregate([
    {
      $match: {
        likedBy: new mongoose.Types.ObjectId(likedBy),
      },
    },
    {
      $lookup: {
        from: "posts",
        localField: "postId",
        foreignField: "_id",
        as: "userLikedPosts",
        pipeline: [
          {
            $project: {
              title: 1,
              content: 1,
              userId: 1,
              slug: 1,
              featuredImage: 1,
              createdAt: {
                $dateToString: {
                  date: "$createdAt",
                  format: "%d %b %Y",
                  timezone: "Asia/Kolkata",
                },
              },
              updatedAt: {
                $dateToString: {
                  date: "$updatedAt",
                  format: "%d %b %Y",
                  timezone: "Asia/Kolkata",
                },
              },
              category: 1,
              likesCount: 1,
              commentsCount: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: "$userLikedPosts",
    },
    {
      $project: {
        _id: 0,
        userLikedPosts: 1,
      },
    },
  ]);

  if (!userLikedPosts) {
    throw new ApiError(400, "No Posts found!");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "User liked posts fetched successfully",
        userLikedPosts,
      ),
    );
});

export {
  getPost,
  publishPost,
  getAllPosts,
  updatePost,
  togglePostLike,
  getQueryPosts,
  getUserLikedPosts,
};
