import { User } from "../models/users.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import uploadToCloudinary from "../utils/cloudinary.js";
import asyncHandler from "../utils/asyncHandler.js";

const registerUser = asyncHandler(async (req, res) => {
  const { email, username, fullName, password } = req.body;

  if (
    [fullName, username, email, password].some(
      (field) => !field || field.trim() === ""
    )
  ) {
    throw new ApiError(400, "Required fields are empty");
  }

  // check: if user already exists
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

  // TODO: search / ask for what if data sent in un ordered way for user creation ?
  const user = await User.create({
    avatar: cloudinaryAvatar ? cloudinaryAvatar.url : null,
    username,
    fullName,
    email,
    password,
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

export { registerUser };
