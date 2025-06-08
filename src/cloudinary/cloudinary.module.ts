import { Module, Global } from '@nestjs/common';
import { CloudinaryProvider } from './cloudinary.provider';
import { CloudinaryService } from './cloudinary.service';
import { CloudinaryController } from './cloudinary.controller';

@Global() 
@Module({
  providers: [CloudinaryProvider, CloudinaryService],
  controllers:[CloudinaryController],
  exports: [CloudinaryService,CloudinaryProvider], 
})
export class CloudinaryModule {}