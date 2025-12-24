import { User } from "../models/users.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import uploadToCloudinary from "../utils/cloudinary.js";
import asyncHandler from "../utils/asyncHandler.js";

// user registration
const registerUser = asyncHandler(async (req, res) => {
  const { email, username, fullName, password } = req.body;

  // empty fields check
  if (
    [fullName, username, email, password].some(
      (field) => !field || field.trim() === ""
    )
  ) {
    throw new ApiError(400, "Required fields are empty");
  }

  // check - if user already exists
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

// generating accessToken and refreshToken for login method
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

// user login
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

// logout user
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

// update user avatar picture
const updateUserAvatar = asyncHandler(async (req, res) => {
  console.log(req.file);
  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  // console.log(avatarLocalPath);
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

export { registerUser, loginUser, updateUserAvatar, logoutUser };
