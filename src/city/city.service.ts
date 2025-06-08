import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { City } from './entities/city.entity';
import { Like, Repository } from 'typeorm';
import { CityMedia } from '../media/entities/cityMedia.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { MediaType } from '../media/entities/media.entity';

@Injectable()
export class CityService {
  constructor(
    @InjectRepository(City)
    private readonly cityRepository: Repository<City>,
    @InjectRepository(CityMedia)
    private cityMediaRepository: Repository<CityMedia>,
    private cloudinaryService: CloudinaryService,
  ) {}

  // Create city
  async create(createCityDto: CreateCityDto) {
    const cityFind = await this.cityRepository.findOneBy({
      city_name: createCityDto.city_name,
    });
    if (cityFind) throw new BadRequestException('city already exist');

    const city = this.cityRepository.create(createCityDto);
    await this.cityRepository.save(city);

    return {
      message: 'city created sucessfully',
      city,
    };
  }
  // Upload city images
  async uploadCityImages(id: number, files: Express.Multer.File[]) {
    const city = await this.cityRepository.findOne({ where: { city_id: id } });
    if (!city) {
      throw new NotFoundException('city not found');
    }
    if (files && files.length > 0) {
      const results = await this.cloudinaryService.uploadFiles(files)  // upload to cloudinary
      console.log(results);

      for (const result of results) {
        const media = this.cityMediaRepository.create({
          media_type: MediaType.IMAGE,
          media_url: result.secure_url,
          public_id: result.public_id,
          city: city,
        });
        await this.cityMediaRepository.save(media);
      }
      return { message: 'all images uploded sucessfully' };
    }
    throw new NotFoundException('no imags provided');
  }
  async deleteCityImages(id: number, filesIds: number[]) {
    const city = await this.cityRepository.findOne({
      where: { city_id: id },
    });
    if (!city) {
      throw new NotFoundException('city not found');
    }
    if (!Array.isArray(filesIds) || filesIds.length === 0) {
      throw new BadRequestException('Files IDs must be an array and cannot be empty.');
    }
    for (const fileId of filesIds) {
      const media = await this.cityMediaRepository.findOne({
        where: { media_id: fileId, city: { city_id: id } },
      });
      if (!media) {
        throw new NotFoundException(
          `file with id ${fileId} not found for property ${id}`,
        );
      }

      await this.cloudinaryService.deleteImageFromCloudinary(media.public_id);
    }

    await this.cityMediaRepository.delete(filesIds);
    return {
      message: 'media deleted successfully',
    };
  }

  // Find all cities
  async getAllcities(city_name?: string) {
    // filter by city_name
    const filters = {
      ...(city_name ? { city_name: Like(`%${city_name}%`) } : {}),
    };
    const cities = await this.cityRepository.find({
      where: filters,
      relations:['neighborhoods']
    });
    return {
      length: cities.length,
      cities,
    };
  }
// Find one city
  async findCity(id: number) {
    const city = await this.cityRepository.findOne({ where: { city_id: id},relations:['neighborhoods'] });
    if (!city) throw new NotFoundException(`no city for ${id} id`);
    return {
      city,
    };
  }
// Update city
  async updateCity(id: number, updateCityDto: UpdateCityDto) {
    const city = await this.cityRepository.findOne({ where: { city_id: id } });
    if (!city) throw new NotFoundException(`no city for ${id} id`);
    const existCity = await this.cityRepository.findOne({
      where: { city_name: updateCityDto.city_name },
    });
    if (existCity && existCity.city_id !== id) {
      throw new BadRequestException('city already exist');
    }
    this.cityRepository.merge(city, updateCityDto);
    await this.cityRepository.save(city);

    return {
      message: 'city updated sucessfully',
      city,
    };
  }
// Remove city
  async remove(id: number) {
    const city = await this.cityRepository.findOne({ where: { city_id: id } });
    if (!city) throw new NotFoundException(`no city for ${id} id`);
    try {
      await this.cityRepository.remove(city);
      return {
        message: 'city deleted sucessfully',
      };
    } catch (error) {
      if (error.message.includes('violates foreign key constraint')) {
        throw new BadRequestException(
         error.message
        );
      }
      throw error;
    }
  }
}
