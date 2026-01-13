import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

import { publishPost } from "../controllers/posts.controller.js";

const router = Router();

router
  .route("/upload-post")
  .post(verifyJWT, upload.single("featuredImage"), publishPost);

export default router;
