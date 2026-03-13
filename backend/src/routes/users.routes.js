import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  registerUser,
  regenerateRegistrationOTP,
  verifyAndLoginUser,
  loginUser,
  updateUserAvatar,
  logoutUser,
  getCurrentUser,
  handleResetPasswordOTP,
  resetUserPassword,
  updateUserDetails,
  getUserLikedPosts,
  removeUserAvatar,
} from "../controllers/users.controller.js";

const router = Router();

router.route("/register").post(registerUser);

router.route("/regenerate-registration-otp").post(regenerateRegistrationOTP);

router.route("/verify-user").post(verifyAndLoginUser);

router.route("/login").post(loginUser);

router.route("/initiate-reset-password-otp").post(handleResetPasswordOTP);

router.route("/reset-password").post(resetUserPassword);

// secured routes
router.route("/logout").post(verifyJWT, logoutUser);

router.route("/get-user-liked-posts").get(verifyJWT, getUserLikedPosts);

router
  .route("/update-avatar")
  .patch(verifyJWT, upload.single("avatar"), updateUserAvatar);

router.route("/remove-avatar").patch(verifyJWT, removeUserAvatar);

router.route("/get-current-user").get(verifyJWT, getCurrentUser);

router.route("/update-user-details").patch(verifyJWT, updateUserDetails);

export default router;
