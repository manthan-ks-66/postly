import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getUser,
  registerUser,
  regenerateRegistrationOTP,
  emailLogin,
  verifyRegisteredUser,
  loginUser,
  updateUserAvatar,
  logoutUser,
  getCurrentUser,
  handleResetPasswordOTP,
  resetUserPassword,
  updateUserDetails,
} from "../controllers/users.controller.js";

const router = Router();

router.route("/register").post(registerUser);

router.route("/verify-user").post(verifyRegisteredUser);

router.route("/regenerate-registration-otp").post(regenerateRegistrationOTP);

router.route("/email-login").post(emailLogin);

router.route("/login").post(loginUser);

router.route("/initiate-reset-password-otp").post(handleResetPasswordOTP);

router.route("/reset-password").post(resetUserPassword);

router.route("/get-user-email/:userId").get(getUser);

// secured routes
router.route("/logout").post(verifyJWT, logoutUser);

router
  .route("/update-avatar")
  .patch(verifyJWT, upload.single("avatar"), updateUserAvatar);

router.route("/get-current-user").get(verifyJWT, getCurrentUser);

router.route("/update-user-details").post(verifyJWT, updateUserDetails);

export default router;
