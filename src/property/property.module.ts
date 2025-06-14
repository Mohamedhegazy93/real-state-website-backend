import { BadRequestException, Module } from '@nestjs/common';
import { PropertyService } from './property.service';
import { PropertyController } from './property.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Property } from './entities/property.entity';
import { User } from '../user/entities/user.entity';
import { Neighborhood } from '../neighborhood/entities/neighborhood.entity';
import { Media } from '../media/entities/media.entity';
import { MulterModule } from '@nestjs/platform-express';
// import { diskStorage } from 'multer'; // ❌ قم بإزالة هذا الاستيراد
import { memoryStorage } from 'multer'; // ✅ استورد memoryStorage بدلاً منه
import { PropertyMedia } from '../media/entities/propertyMedia.entity';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { AuthModule } from '../auth/auth.module';
import { UserService } from '../user/user.service';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([Property, User, Neighborhood, Media, PropertyMedia]),
    CloudinaryModule,
    MulterModule.register({
      storage: memoryStorage(), // ✅ استخدم memoryStorage() هنا بدلاً من diskStorage
      fileFilter: (req, file, cb) => {
        if (
          file.mimetype.startsWith('image') ||
          file.mimetype.startsWith('video')
        ) {
          cb(null, true);
        } else {
          cb(new BadRequestException('unsupported file format'), false);
        }
      },
      limits: {
        fileSize: 200 * 1024 * 1024,
      },
    }),
  ],
  controllers: [PropertyController],
  providers: [PropertyService, CloudinaryService, UserService],
})
export class PropertyModule {}