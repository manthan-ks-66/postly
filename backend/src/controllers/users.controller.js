import { User } from "../models/users.model.js";
import { PostLike } from "../models/postLikes.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadToImageKit, deleteImageKitFile } from "../utils/imagekit.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { randomInt } from "node:crypto";
import nodemailer from "nodemailer";
import mongoose, { isValidObjectId } from "mongoose";

// nodemailer: transporter config
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const options = {
  httpOnly: true,
  secured: true,
};

const generateAndSendOTP = async (processMsg, user, email, subject) => {
  const otp = randomInt(100000, 999999);

  await user.hashOTP(otp);
  await user.save();

  const mailMsg = `
Hi ${user.fullName.trim().split(" ")[0]}, 

To continue with the ${processMsg} on Postly, 

Use the One Time Password (OTP): ${otp} 

This OTP is valid for 2 minutes. Do not share this code with anyone

Thank You`;

  await transporter.sendMail({
    from: process.env.EMAIL_ADDRESS,
    to: email,
    subject: subject,
    text: mailMsg,
  });
};

// Controller: user registration
const registerUser = asyncHandler(async (req, res) => {
  const { email, username, fullName, password } = req.body;

  if (
    [fullName, username, email, password].some(
      (field) => !field || field.trim() === "",
    )
  ) {
    throw new ApiError(400, "Required fields are empty");
  }

  const existedUsername = await User.findOne({ username: username });

  if (existedUsername) {
    throw new ApiError(400, "Username is already taken");
  }

  const existedUser = await User.findOne({ email: email });

  if (existedUser) {
    if (existedUser.isVerified) {
      throw new ApiError(400, "User is already registered, Please login");
    }

    Object.assign(existedUser, {
      fullName,
      email,
      password,
      username,
      lifeTime: Date.now(),
    });

    await generateAndSendOTP(
      "registration process",
      existedUser,
      email,
      "One Time Password for user registration",
    );

    const verificationToken = existedUser.generateVerificationToken();

    return res
      .status(201)
      .cookie("verificationToken", verificationToken, options)
      .json(
        new ApiResponse(200, "OTP for registration has been sent successfully"),
      );
  }

  const user = await User.create({
    username,
    email,
    password,
    fullName,
    lifeTime: Date.now(),
  });

  if (!user) {
    throw new ApiError(500, "User registration failed");
  }

  await generateAndSendOTP(
    "registration process",
    user,
    email,
    "One Time Password for user registration",
  );

  const verificationToken = user.generateVerificationToken();

  return res
    .status(201)
    .cookie("verificationToken", verificationToken, options)
    .json(
      new ApiResponse(
        201,
        "User registered and OTP has been sent successfully",
      ),
    );
});

const regenerateRegistrationOTP = asyncHandler(async (req, res) => {
  const verificationToken = req.cookies?.verificationToken;

  if (!verificationToken) {
    throw new ApiError(400, "Invalid token: User is not registered");
  }

  const decodedToken = jwt.verify(
    verificationToken,
    process.env.VERIFICATION_TOKEN_SECRET,
  );

  const user = await User.findOne({ _id: decodedToken._id });

  if (!user) {
    throw new ApiError(400, "User not found!");
  }

  if (user.isVerified) {
    throw new ApiError(400, "User is verified");
  }

  await generateAndSendOTP(
    "registration process",
    user,
    user.email,
    "One Time Password for user registration",
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "OTP re-sent to the registered email successfully",
        {},
      ),
    );
});

// Controller: verify and login registered user
const verifyAndLoginUser = asyncHandler(async (req, res) => {
  /**
   * get verificationToken, otp from req
   * decode the token and check the token expiry
   * find the user from the decoded token
   * check if otp is expired
   * check if otp is correct
   * update the user as verified
   * generate user tokens to login the user
   * return res - user login
   */

  const { otp } = req.body;

  const verificationToken = req.cookies?.verificationToken;

  if (!verificationToken) {
    throw new ApiError(400, "Invalid token: User is not registered");
  }

  const decodedToken = jwt.verify(
    verificationToken,
    process.env.VERIFICATION_TOKEN_SECRET,
  );

  const userAccount = await User.findOne({ _id: decodedToken._id });

  if (!userAccount) {
    throw new ApiError(400, "User not found");
  }

  const userId = userAccount._id;

  if (Date.now() > userAccount.otpExpiry) {
    throw new ApiError(400, "OTP is expired! Register Again");
  }

  const isOTPCorrect = await userAccount.isOtpCorrect(otp);

  if (!isOTPCorrect) {
    throw new ApiError(400, "Invalid OTP");
  }

  const user = await User.findOneAndUpdate(
    { _id: userId },
    {
      $set: {
        isVerified: true,
      },
      $unset: {
        lifeTime: true,
        OTP: true,
        otpExpiry: true,
      },
    },
    { new: true },
  );

  const { accessToken, refreshToken } = await generateUserTokens({
    user,
  });

  return res
    .status(200)
    .clearCookie("verificationToken")
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        "User verified and user tokens returned successfully",
        user.toJSON(),
      ),
    );
});

// Method: generating accessToken and refreshToken for user auth
const generateUserTokens = async ({ user }) => {
  try {
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save();

    const loggedInUser = user.toJSON();

    return { loggedInUser, accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, error.message);
  }
};

// Controller: user login
const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await User.findOne({
    $or: [{ username }, { email: username }],
  });

  if (!user) {
    throw new ApiError(401, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const { loggedInUser, accessToken, refreshToken } = await generateUserTokens({
    user,
  });

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(200, "User tokens returned successfully", {
        user: loggedInUser,
      }),
    );
});

// Controller: logout user
const logoutUser = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  await User.findByIdAndUpdate(userId, {
    $unset: {
      refreshToken: 1,
    },
  });

  return res
    .status(200)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json(new ApiResponse(200, "User tokens removed successfully", {}));
});

// Controller: update user avatar picture
const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;

  const userId = req.user?._id;

  const fileName = req.file?.originalname;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const oldFileId = user.avatar?.fileId;

  const imagekitAvatar = await uploadToImageKit(
    avatarLocalPath,
    fileName,
    "users",
  );

  if (!imagekitAvatar) {
    throw new ApiError(500, "File upload failed");
  }

  try {
    user.avatar = {
      url: imagekitAvatar.url,
      fileId: imagekitAvatar.fileId,
    };

    await user.save();
  } catch (error) {
    if (imagekitAvatar?.fileId) {
      try {
        await deleteImageKitFile(imagekitAvatar.fileId);
      } catch (cleanupErr) {
        console.log("Imagekit rollback delete failed\n", cleanupErr.message);
      }
    }

    throw new ApiError(400, "User avatar update failed");
  }

  if (oldFileId) {
    try {
      await deleteImageKitFile(oldFileId);
    } catch (error) {
      console.log("imagekit avatar file deletion failed\n", error.message);
    }
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Avatar updated successfully", user.toJSON()));
});

// Controller: remove user avatar
const removeUserAvatar = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  const user = await User.findById(userId);

  if (!user?.avatar?.fileId) {
    throw new ApiError(400, "No avatar image found");
  }

  const { fileId } = user.avatar;

  // delete from imagekit
  try {
    await deleteImageKitFile(fileId);
  } catch (error) {
    console.log("Imagekit file deletion failed", error.message);
  }

  user.avatar = null;
  await user.save();

  return res
    .status(200)
    .json(
      new ApiResponse(200, "User avatar removed successfully", user.toJSON()),
    );
});

// Controller: Get user details
const getCurrentUser = asyncHandler(async (req, res) => {
  const user = req.user;

  return res
    .status(200)
    .json(new ApiResponse(200, "User details fetched successfully", user));
});

// Controller: send the OTP to user for password reset
const handleResetPasswordOTP = asyncHandler(async (req, res) => {
  /* 
  get email from req.body

  find the user in the db
    - throw error if user is not found

  generate cryptoOtp and otpExpiry

  hash the otp using bcrypt (user.hashOTP)

  save the cryptoOtp (hashed) and otpExpiry in the db

  send the cryptoOtp to user in mail
  
  return res as otp sent */

  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(400, "User not found!");
  }

  const otp = randomInt(100000, 999999);

  await user.hashOTP(otp);
  await user.save();

  await generateAndSendOTP(
    "password reset process",
    user,
    email,
    "Password reset One Time PassCode",
  );

  return res.status(200).json(new ApiResponse(200, "OTP sent successfully"));
});

// Controller: Reset user password
const resetUserPassword = asyncHandler(async (req, res) => {
  /* 
    get email , otp, newPassword, confirmNewPassword from req.body

    find the user in the db through email
      - throw error if user is not found

    check if the otp is expired 
      - throw error if Date.now is > otpExpiry

    check if otp is correct 

    check newPassword is equal to confirmNewPassword

    update the user password in the db and set the passwordResetOTP and otpExpiry field as null 

    return res - password updated
   */

  const { email, otp, newPassword, confirmNewPassword } = req.body;

  if (
    [email, otp, newPassword, confirmNewPassword].some(
      (field) => !field || field.trim() === "",
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(400, "User not found!");
  }

  if (Date.now() > user.otpExpiry) {
    throw new ApiError(400, "OTP Expired");
  }

  const isOTPValid = user.isOtpCorrect(otp);

  if (!isOTPValid) {
    throw new ApiError(400, "Invalid OTP");
  }

  if (newPassword !== confirmNewPassword) {
    throw new ApiError(400, "Password doesn't match with confirmed password");
  }

  const updatedUser = await User.findOneAndUpdate(
    { email: email },
    {
      $set: {
        password: newPassword,
      },
      $unset: {
        OTP: true,
        otpExpiry: true,
      },
    },
    { new: true },
  );

  if (!updatedUser) {
    throw new ApiError(500, "Password update failed");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Password changed successfully", {}));
});

// Controller: Update user details
const updateUserDetails = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  const { bio, fullName, about } = req.body;

  if (!bio && !fullName && !about) {
    throw new ApiError(400, "Fields are empty");
  }

  const user = await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        bio,
        fullName,
        about,
      },
    },
    {
      new: true,
    },
  );

  if (!user) {
    throw new ApiError(400, "Cannot find user");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, "User details updated successfully", user.toJSON()),
    );
});

// Controller: refresh accessToken
// TODO: Postman testing
const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingToken = req.cookies?.refreshToken;

  if (!incomingToken) {
    throw new ApiError(400, "User Unauthenticated");
  }

  const decodedToken = jwt.verify(
    incomingToken,
    process.env.REFRESH_TOKEN_SECRET,
  );

  const user = await User.findById(decodedToken._id);

  if (!user) {
    throw new ApiError(400, "Invalid token");
  }

  if (user.refreshToken !== incomingToken) {
    throw new ApiError(400, "Refresh token is Invalid");
  }

  const { loggedInUser, accessToken, refreshToken } = await generateUserTokens(
    user._id,
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(200, "User tokens returned successfully", loggedInUser),
    );
});

// Controller: Get user liked posts
const getUserLikedPosts = asyncHandler(async (req, res) => {
  const likedBy = req.user?._id;

  if (!isValidObjectId(likedBy)) {
    throw new ApiError(400, "Invalid user id");
  }

  // left join of PostLikes (left) with Posts (right) and Posts (array) with Users (right)
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
        as: "userLikedPost",
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
      $unwind: "$userLikedPost",
    },
    {
      $project: {
        _id: 0,
        userLikedPost: 1,
      },
    },
  ]);

  if (userLikedPosts.length === 0) {
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

// Controller: Delete user account
const deleteUserAccount = asyncHandler(async (req, res) => {
  //  delete user
});

export {
  registerUser,
  regenerateRegistrationOTP,
  removeUserAvatar,
  verifyAndLoginUser,
  loginUser,
  updateUserAvatar,
  logoutUser,
  getCurrentUser,
  resetUserPassword,
  handleResetPasswordOTP,
  updateUserDetails,
  refreshAccessToken,
  deleteUserAccount,
  getUserLikedPosts,
};
