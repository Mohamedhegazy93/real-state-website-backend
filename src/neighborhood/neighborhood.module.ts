import { BadRequestException, Module } from '@nestjs/common';
import { NeighborhoodService } from './neighborhood.service';
import { NeighborhoodController } from './neighborhood.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Neighborhood } from './entities/neighborhood.entity';
import { City } from '../city/entities/city.entity';
import { CityModule } from '../city/city.module';
import { NeighborhoodMedia } from '../media/entities/neighborhoodMedia.entity';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { Media } from '../media/entities/media.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Neighborhood,City,Media,NeighborhoodMedia]),CityModule,
  CloudinaryModule,
  MulterModule.register({
    storage: diskStorage({
      destination: './images',
      filename: (req, file, cb) => {
        const prefix = `${Date.now()}-${Math.round(Math.random() * 1000000)}`;
        const filename = `${prefix}-${file.originalname}`;
        cb(null, filename);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (
        file.mimetype.startsWith('image')
    
      ) {
        cb(null, true);
      } else {
        cb(new BadRequestException('unsupported file format'), false);
      }
    },
    limits: {
      fileSize: 5 * 1024 * 1024,
    },
  })
],
  controllers: [NeighborhoodController],
  providers: [NeighborhoodService,CloudinaryService],
})
export class NeighborhoodModule {}
