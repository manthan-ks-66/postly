import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { ApiError } from "../utils/ApiError.js";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = async (filePath) => {
  try {
    const response = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
    });

    return response;
  } catch (error) {
    throw new ApiError(500, error.message);
  } finally {
    try {
      await fs.promises.unlink(filePath);
    } catch (error) {
      console.log("Local file cleanup failed", error.message);
    }
  }
};

export default uploadToCloudinary;
