import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/users.model.js";

const verifyJWT = async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    // console.log(token);

    if (!token) {
      throw new ApiError(401, "Invalid token: Unauthorized");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // console.log(decodedToken);

    const user = await User.findById(decodedToken._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "Unauthorized: Cannot find user");
    }

    req.user = user;
    console.log(req.header)
    next();
  } catch (error) {
    console.log(error);
    throw new ApiError(500, error.message || "Something went wrong");
  }
};

export { verifyJWT };
