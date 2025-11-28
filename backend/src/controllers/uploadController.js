import { uploadToCloudinary } from '../utils/cloudinaryUpload.js';

export const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const result = await uploadToCloudinary(req.file.path);
    res.json({ url: result.secure_url });
  } catch (err) {
    next(err);
  }
};
