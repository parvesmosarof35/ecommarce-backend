import { v2 as cloudinary } from 'cloudinary';
import config from '../config';

cloudinary.config({
  cloud_name: config.Cloudinary?.CLOUDINARY_CLOUD_NAME,
  api_key: config.Cloudinary?.CLOUDINARY_API_KEY,
  api_secret: config.Cloudinary?.CLOUDINARY_API_SECRET,
  secure: true,
});

export type CloudinaryUploadResult = {
  secure_url: string;
  public_id: string;
};

export const uploadImageToCloudinary = async (
  filePath: string,
  folder: string
): Promise<CloudinaryUploadResult> => {
  if (
    !config.Cloudinary?.CLOUDINARY_CLOUD_NAME ||
    !config.Cloudinary?.CLOUDINARY_API_KEY ||
    !config.Cloudinary?.CLOUDINARY_API_SECRET
  ) {
    throw new Error('Cloudinary credentials are not configured');
  }

  const result = await cloudinary.uploader.upload(filePath, {
    folder,
    resource_type: 'image',
  });

  return {
    secure_url: result.secure_url,
    public_id: result.public_id,
  };
};

export const deleteFromCloudinary = async (publicId: string) => {
  if (!publicId) return;

  await cloudinary.uploader.destroy(publicId, {
    resource_type: 'image',
  });
};
