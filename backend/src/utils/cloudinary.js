import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = async (filePath) => {
  try {
    const response = await cloudinary.uploader.upload(filePath, {
      resource_type: "image",
    });

    return response;
  } catch (error) {
    console.log(error);
    return error.message;
  } finally {
    try {
      await fs.promises.unlink(filePath);
    } catch (error) {
      console.log("Error in unlinking the local file path: \n", error.message);
    }
  }
};

export default uploadToCloudinary;
