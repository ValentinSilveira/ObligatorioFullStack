import cloudinary from "../config/cloudinary.config.js";

export const createImage = (file) => {
  const folder = process.env.CLOUD_FOLDER?.trim() || "Tareas";

  return cloudinary.uploader.upload(file, {
    folder,
  });
};

export const deleteImage = (publicId) => {
  return cloudinary.uploader.destroy(publicId);
};