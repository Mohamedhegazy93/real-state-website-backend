import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateNeighborhoodDto } from './dto/create-neighborhood.dto';
import { UpdateNeighborhoodDto } from './dto/update-neighborhood.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Neighborhood } from './entities/neighborhood.entity';
import { Repository } from 'typeorm';
import { City } from '../city/entities/city.entity';
import { NeighborhoodMedia } from '../media/entities/neighborhoodMedia.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { MediaType } from '../media/entities/media.entity';

@Injectable()
export class NeighborhoodService {
  constructor(
    @InjectRepository(Neighborhood)
    private readonly neighborhoodRepository: Repository<Neighborhood>,
    @InjectRepository(City)
    private readonly cityRepository: Repository<City>,
    @InjectRepository(NeighborhoodMedia)
    private readonly neighborhoodMediaRepository: Repository<NeighborhoodMedia>,
    private cloudinaryService: CloudinaryService,

  ) {}

  async create(createNeighborhoodDto: CreateNeighborhoodDto) {
    const city = await this.cityRepository.findOne({
      where: { city_id: createNeighborhoodDto.city_id },
    });
    if (!city) {
      throw new NotFoundException('City not found');
    }

    // Check Neighborhood exist
    const existingNeighborhood = await this.neighborhoodRepository.findOne({
      where: {
        neighborhood_name: createNeighborhoodDto.neighborhood_name,
        city: { city_id: createNeighborhoodDto.city_id },
      },
    });
    if (existingNeighborhood) {
      throw new BadRequestException('Neighborhood already exists in this city');
    }

    // Create Neighborhood
    const neighborhood = this.neighborhoodRepository.create({
      neighborhood_name: createNeighborhoodDto.neighborhood_name,
      city: city,
    });

    // Save
    await this.neighborhoodRepository.save(neighborhood);

    return {
      message: 'Neighborhood created successfully',
      neighborhood,
    };
  }

  async uploadNeighborhoodImages(id: number, files: Express.Multer.File[]) {
    const neigbohood = await this.neighborhoodRepository.findOne({
      where: { neighborhood_id: id },
    });
    if (!neigbohood) {
      throw new NotFoundException('neighborhood not found');
    }
    if (files && files.length > 0) {
      const results = await this.cloudinaryService.uploadFiles(files)  // upload to cloudinary
      console.log(results);
      for (const result of results) {
        const media = this.neighborhoodMediaRepository.create({
          media_type: MediaType.IMAGE,
          media_url: result.secure_url,
          public_id: result.public_id,
          neighborhood: neigbohood,
        });
        await this.neighborhoodMediaRepository.save(media);
      }
      return {
        message: 'all files uploded successfully',
      };
    }
    throw new BadRequestException('no files provided');
  }
  async deleteNeighborhoodImages(id: number, filesIds: number[]) {
    const neighborhood = await this.neighborhoodRepository.findOne({
      where: { neighborhood_id: id },
    });
    if (!neighborhood) {
      throw new NotFoundException('neighborhood not found');
    }
    for (const fileId of filesIds) {
      const media = await this.neighborhoodMediaRepository.findOne({
        where: { media_id: fileId, neighborhood: { neighborhood_id: id } },
      });
      if (!media) {
        throw new NotFoundException(
          `file with id ${fileId} not found for neighborhood ${id}`,
        );
      }

      await this.cloudinaryService.deleteImageFromCloudinary(media.public_id);
    }

    await this.neighborhoodMediaRepository.delete(filesIds);
    return {
      message: 'media deleted successfully',
    };
  }

  async findAll() {
    const neighborhoods = await this.neighborhoodRepository.find({
      relations: ['city'],
    });
    if (!neighborhoods) throw new NotFoundException();
    return {
      length: neighborhoods.length,
      neighborhoods,
    };
  }
  // neigbohood/cityid/neighbohood
  async findNeighborhoodsOfCity(city_id: number) {
    const city = await this.cityRepository.findOne({
      where: { city_id: city_id },
    });
    if (!city) throw new NotFoundException('city not found');

    const neigbohoods = await this.neighborhoodRepository.find({
      where: { city: { city_id: city_id } },
    });
    if (!neigbohoods)
      throw new NotFoundException(
        `no neigbohoods founded in ${city.city_name} yet`,
      );
    return {
      length: neigbohoods.length,
      neigbohoods,
    };
  }

  async findOne(id: number) {
    const neighborhood = await this.neighborhoodRepository.findOne({
      where: { neighborhood_id: id },
      relations: ['city'],
    });
    if (!neighborhood) throw new NotFoundException();
    return {
      neighborhood,
    };
  }

  async update(id: number, updateNeighborhoodDto: UpdateNeighborhoodDto) {
    const neighborhood = await this.neighborhoodRepository.findOne({
      where: { neighborhood_id: id },
    });
    if (!neighborhood) throw new NotFoundException();

    if (updateNeighborhoodDto.city_id) {
      const city = await this.neighborhoodRepository.findOne({
        where: { city: { city_id: updateNeighborhoodDto.city_id } },
      });
      if (!city) throw new NotFoundException('city not found');
    }
    const existingNeighborhood = await this.neighborhoodRepository.findOne({
      where: {
        neighborhood_name: updateNeighborhoodDto.neighborhood_name,
        city: { city_id: updateNeighborhoodDto.city_id },
      },
    });

    if (existingNeighborhood && existingNeighborhood.neighborhood_id !== id) {
      throw new BadRequestException('Neighborhood already exists in this city');
    }

    if (updateNeighborhoodDto.neighborhood_name !== undefined) {
      neighborhood.neighborhood_name = updateNeighborhoodDto.neighborhood_name;
    }

    if (updateNeighborhoodDto.city_id !== undefined) {
      const city = await this.cityRepository.findOne({
        where: { city_id: updateNeighborhoodDto.city_id },
      });
      if (!city) {
        throw new NotFoundException('city not found');
      }
      neighborhood.city = city;
    }

    await this.neighborhoodRepository.save(neighborhood);

    return {
      messgae: 'neighborhood updated sucessfully',
      neighborhood,
    };
  }
  async remove(id: number) {
    const neighborhood = await this.neighborhoodRepository.findOne({
      where: { neighborhood_id: id },
    });

    if (!neighborhood) throw new NotFoundException('neighborhood not found');
    try {
      await this.neighborhoodRepository.remove(neighborhood);
      return {
        message: 'neighborhood deleted sucessfully',
      };
    } catch (error) {
      if (error.message.includes('violates foreign key constraint')) {
        throw new BadRequestException(
          'can not delete this neighborhood because it has related property',
        );
      }
      throw error;
    }
  }
}
