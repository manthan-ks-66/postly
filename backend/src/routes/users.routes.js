import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  registerUser,
  loginUser,
  updateUserAvatar,
  logoutUser,
  getCurrentUser,
  handleOTP,
  resetUserPassword,
  updateUserDetails,
} from "../controllers/users.controller.js";

const router = Router();

router.route("/register").post(upload.single("avatar"), registerUser);

router.route("/login").post(upload.none(), loginUser);

router.route("/send-otp").post(handleOTP);

router.route("/reset-password").post(resetUserPassword);

// secured routes
router.route("/logout").post(verifyJWT, logoutUser);

router
  .route("/update-avatar")
  .patch(verifyJWT, upload.single("avatar"), updateUserAvatar);

router.route("/get-current-user").get(verifyJWT, getCurrentUser);

router.route("/update-user-details").post(verifyJWT, updateUserDetails);

export default router;
