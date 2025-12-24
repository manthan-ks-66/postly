import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  registerUser,
  loginUser,
  updateUserAvatar,
  logoutUser,
} from "../controllers/users.controller.js";

const router = Router();

// TODO: Question: why registerUser is passed as referance whereas in the controller it expects req, res parameters
// what's going on behind the scene with router

router.route("/register").post(upload.single("avatar"), registerUser);

router.route("/login").post(upload.none(), loginUser);

// secured routes
router
  .route("/update-avatar")
  .patch(upload.single("avatar"), verifyJWT, updateUserAvatar);

router.route("/logout").post(verifyJWT, logoutUser);

export default router;
