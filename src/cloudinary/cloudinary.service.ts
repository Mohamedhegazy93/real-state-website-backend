import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import * as fs from 'fs-extra';
import * as path from 'path';

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadFiles(files: Express.Multer.File[]): Promise<UploadApiResponse[]> {
    const uploadPromises = files.map(file => {
      return new Promise<UploadApiResponse>(async (resolve, reject) => {
        const imagePath = path.join(__dirname, `../../images/${file.filename}`);
        try {
          const result = await cloudinary.uploader.upload(imagePath);
          await fs.remove(imagePath); // remove file from server
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
    });

    return Promise.all(uploadPromises);
  }
  async deleteImageFromCloudinary(publicId: string): Promise<any> {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result;
    } catch (error) {
      console.error(`Error deleting image with public_id ${publicId}:`, error);
      throw error;
    }
  }
}