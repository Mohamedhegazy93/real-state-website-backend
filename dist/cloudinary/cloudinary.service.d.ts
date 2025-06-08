import { UploadApiResponse } from 'cloudinary';
export declare class CloudinaryService {
    constructor();
    uploadFiles(files: Express.Multer.File[]): Promise<UploadApiResponse[]>;
    deleteImageFromCloudinary(publicId: string): Promise<any>;
}
