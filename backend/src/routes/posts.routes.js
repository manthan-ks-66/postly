import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

import {
  publishPost,
  togglePostLike,
} from "../controllers/posts.controller.js";

const router = Router();

router
  .route("/publish-post")
  .post(verifyJWT, upload.single("featuredImage"), publishPost);

router.route("/toggle-like").post(verifyJWT, togglePostLike);

export default router;
