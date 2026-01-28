import { User } from "../models/users.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import uploadToCloudinary from "../utils/cloudinary.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { randomInt } from "node:crypto";
import nodemailer from "nodemailer";

// nodemailer: transporter config
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Controller: user registration
const registerUser = asyncHandler(async (req, res) => {
  const { email, username, fullName, password } = req.body;

  if (
    [fullName, username, email, password].some(
      (field) => !field || field.trim() === ""
    )
  ) {
    throw new ApiError(400, "Required fields are empty");
  }

  const existedUser = await User.findOne({ $or: [{ username }, { email }] });

  if (existedUser) {
    throw new ApiError(400, "User with this email or username already exists");
  }

  // null - indicates the variable represents intentional absence of object / value
  // used for later adding object / value to the variable
  let cloudinaryAvatar = null;

  const avatarLocalPath = req.file?.path;

  if (avatarLocalPath) {
    cloudinaryAvatar = await uploadToCloudinary(avatarLocalPath);

    if (!cloudinaryAvatar) {
      throw new ApiError(500, "File upload failed");
    }
  }

  // user creation
  const user = await User.create({
    avatar: cloudinaryAvatar ? cloudinaryAvatar.url : null,
    username,
    email,
    password,
    fullName,
  });

  if (!user) {
    throw new ApiError(500, "User registration failed");
  }

  const userObject = user.toObject();

  delete userObject.password;

  return res
    .status(201)
    .json(new ApiResponse(201, "User registered successfully", userObject));
});

// Method: generating accessToken and refreshToken for user auth
const generateUserTokens = async ({ user }) => {
  try {
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save();

    // remove password and refreshToken field
    const loggedInUser = user.toObject();
    delete loggedInUser.password;
    delete loggedInUser.refreshToken;

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
      })
    );
});

// Controller: logout user
const logoutUser = asyncHandler(async (req, res) => {
  const userId = req.user?.id;

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

// Controller: update user picture
const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const cloudinaryAvatar = await uploadToCloudinary(avatarLocalPath);

  if (!cloudinaryAvatar) {
    throw new ApiError(500, "File upload failed");
  }

  const user = await User.findOneAndUpdate(
    { _id: req.user?._id },
    {
      $set: {
        avatar: cloudinaryAvatar.url,
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  if (!user) {
    throw new ApiError(500, "Avatar update failed");
  }

  return res.status(200).json(
    new ApiResponse(200, "Avatar updated successfully", {
      avatar: user.avatar,
    })
  );
});

// Controller: Get user details
const getCurrentUser = asyncHandler(async (req, res) => {
  const user = req.user;

  return res
    .status(200)
    .json(new ApiResponse(200, "User details fetched successfully", user));
});

// Controller: send the OTP to user in mail
const handleOTP = asyncHandler(async (req, res) => {
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

  const mailMsg = `
Hi ${user.fullName.trim().split(" ")[0]}, 

To continue with the password reset process on Postly, 

Use the One Time Password (OTP): ${otp} 

This OTP is valid for 2 minutes. Do not share this code with anyone.

Thank You`;

  const info = transporter.sendMail({
    from: process.env.EMAIL_ADDRESS,
    to: email,
    subject: "Password Reset OTP",
    text: mailMsg,
  });

  if (!info) {
    throw new ApiError(500, "Failed to send the OTP");
  }

  return res.status(200).json(new ApiResponse(200, "OTP sent successfully"));
});

// Controller: Reset user password
const resetUserPassword = asyncHandler(async (req, res) => {
  /* 
    get email , cryptoOtp, newPassword, confirmNewPassword from req.body

    find the user in the db through email
      - throw error if user is not found

    check if the otp is expired 
      - throw error if Date.now is > otpExpiry

    check if cryptoOtp is correct 

    check newPassword is equal to confirmNewPassword

    update the user password in the db and set the passwordResetOTP and otpExpiry field as null 

    return res - password updated
   */

  const { email, otp, newPassword, confirmNewPassword } = req.body;

  if (
    [email, otp, newPassword, confirmNewPassword].some(
      (field) => !field || field.trim() === ""
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

  user.password = newPassword;
  user.OTP = undefined;
  user.otpExpiry = undefined;
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, "Password changed successfully", {}));
});

// Controller: Update user details
// TODO: Postman testing
const updateUserDetails = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  const { email, fullName, username } = req.body;

  if (!email && !fullName && !username) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        email,
        username,
        fullName,
      },
    },
    {
      new: true,
    }
  );

  if (!user) {
    throw new ApiError(400, "Cannot find user");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "User details updated successfully", user));
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
    process.env.REFRESH_TOKEN_SECRET
  );

  const user = await User.findById(decodedToken._id);

  if (!user) {
    throw new ApiError(400, "Invalid token");
  }

  if (user.refreshToken !== incomingToken) {
    throw new ApiError(400, "Refresh token is Invalid");
  }

  const { loggedInUser, accessToken, refreshToken } = await generateUserTokens(
    user._id
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
      new ApiResponse(200, "User tokens returned successfully", loggedInUser)
    );
});

// Controller: Delete user account
const deleteUserAccount = asyncHandler(async (req, res) => {
  //  delete user
});

export {
  registerUser,
  loginUser,
  updateUserAvatar,
  logoutUser,
  getCurrentUser,
  resetUserPassword,
  handleOTP,
  updateUserDetails,
  deleteUserAccount,
};
