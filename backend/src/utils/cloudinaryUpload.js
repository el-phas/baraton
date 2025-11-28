import cloudinary from '../config/cloudinary.js';

export const uploadToCloudinary = async (filePath) => {
  return await cloudinary.uploader.upload(filePath, {
    folder: 'baraton-oasis',
  });
};
