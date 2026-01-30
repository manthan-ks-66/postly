import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

import {
  getPost,
  updatePost,
  publishPost,
  togglePostLike,
  getAllPosts,
  getQueryPosts,
  getUserLikedPosts,
  uploadEditorImage,
} from "../controllers/posts.controller.js";

const router = Router();

router.route("/get-all-posts").get(getAllPosts);

router.route("/get-query-post").get(getQueryPosts);

router.route("/get-post/:postId").get(getPost);

// secured routes:
router
  .route("/upload-to-imagekit")
  .post(verifyJWT, upload.single("editor-image"), uploadEditorImage);

router
  .route("/publish-post")
  .post(verifyJWT, upload.single("featuredImage"), publishPost);

router.route("/toggle-like").post(verifyJWT, togglePostLike);

router.route("/get-user-liked-posts").get(verifyJWT, getUserLikedPosts);

router
  .route("/update-post/:postId")
  .patch(verifyJWT, upload.single("featuredImage"), updatePost);

export default router;
