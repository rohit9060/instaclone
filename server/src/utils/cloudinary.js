import { v2 as cloudinary } from "cloudinary";
import { env } from "./configs.js";
import fs from "fs";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

class CloudinaryService {
  // upload single image
  uploadSingleImage = async (file, folder) => {
    const result = await cloudinary.uploader.upload(file.path, {
      folder,
    });

    // delete temp file
    fs.unlinkSync(file.path);

    return result;
  };

  // upload multiple images
  uploadMultipleImages = async (files, folder) => {
    const promises = files.map((file) => {
      cloudinary.uploader.upload(file.path, {
        folder,
      });
    });

    const result = Promise.all(promises);

    // delete temp files
    files.forEach((file) => {
      fs.unlinkSync(file.path);
    });

    return result;
  };

  // delete single
  deleteImage = async (publicId) => {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  };

  // delete multiple
  deleteMultipleImages = async (publicIds) => {
    const promises = publicIds.map((publicId) => {
      cloudinary.uploader.destroy(publicId);
    });

    const result = Promise.all(promises);
    return result;
  };
}

export const cloudinaryService = new CloudinaryService();
