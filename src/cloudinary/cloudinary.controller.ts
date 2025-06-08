
import {
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from './cloudinary.service';
  // ... other imports
  
  @Controller('')
  export class CloudinaryController {
    constructor(private readonly cloudinaryService: CloudinaryService) {}

  
    // @Post('')
    // @UseInterceptors(FileInterceptor('files'))
    // uploadImage(@UploadedFile() files: Express.Multer.File[]) {
    //   return this.cloudinaryService.uploadFiles(files);
    // }
  }
  