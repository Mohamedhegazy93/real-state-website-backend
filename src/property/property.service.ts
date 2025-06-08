import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Property } from './entities/property.entity';
import { Neighborhood } from '../neighborhood/entities/neighborhood.entity';
import { Repository } from 'typeorm';
import { User, UserRole } from '../user/entities/user.entity';
import { MediaType } from '../media/entities/media.entity';
import { PropertyMedia } from '../media/entities/propertyMedia.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class PropertyService {
  constructor(
    @InjectRepository(Property)
    private propertyRepository: Repository<Property>,
    @InjectRepository(Neighborhood)
    private neighborhoodRepository: Repository<Neighborhood>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(PropertyMedia)
    private propertyMediaRepository: Repository<PropertyMedia>,
    private cloudinaryService: CloudinaryService,
  ) {}

  // Create Property
  async createProperty(createPropertyDto: CreatePropertyDto, payload) {
    const { neighborhood_id, ...propertyData } = createPropertyDto;

    const neighborhood = await this.neighborhoodRepository.findOne({
      where: { neighborhood_id: neighborhood_id },
    });
    if (!neighborhood) {
      throw new NotFoundException(
        `Neighborhood with ID ${neighborhood_id} not found`,
      );
    }
    const user = await this.userRepository.findOneBy({ id: payload.id });
    if (!user) {
      throw new NotFoundException(`User with ID  not found`);
    }

    const propertyExist = await this.propertyRepository.findOne({
      where: {
        title: createPropertyDto.title,
        neighborhood: { neighborhood_id: createPropertyDto.neighborhood_id },
      },
    });
    if (propertyExist) {
      throw new BadGatewayException(
        'property already exist in this neighborhood according to his title , please change title',
      );
    }

    const property = this.propertyRepository.create({
      ...propertyData,
      neighborhood,
      user: { id: payload.id },
    });
    await this.propertyRepository.save(property);

    return {
      message: 'property created sucessfully',
      property,
    };
  }
  // Upload property files
  async uploadPropertyFiles(id: number, files: Express.Multer.File[]) {
    const property = await this.propertyRepository.findOne({
      where: { property_id: id },
    });
    if (!property) {
      throw new NotFoundException('property not found');
    }

    if (files && files.length > 0) {
      const results = await this.cloudinaryService.uploadFiles(files); // upload to cloudinary

      for (const result of results) {
        const media = this.propertyMediaRepository.create({
          media_type: MediaType.IMAGE,
          media_url: result.secure_url,
          public_id: result.public_id,
          property: property,
        });

        await this.propertyMediaRepository.save(media);
      }
      return {
        message: 'all files uploded successfully',
      };
    }
    throw new BadRequestException('no files provided');
  }
  // Find property files
  async findPropertyFiles(id: number) {
    const property = await this.propertyRepository.findOne({
      where: { property_id: id },
    });
    if (!property) {
      throw new NotFoundException('property not found');
    }

    const propertyFiles = await this.propertyMediaRepository.find({
      where: { property: { property_id: id } },
    });
    if (propertyFiles && propertyFiles.length > 0) {
      return {
        propertyFiles,
      };
    }
    throw new NotFoundException('no media for this property');
  }

  // Find all propertys
  async findAllProperties(): Promise<{ propertys: Property[] }> {
    const propertys = await this.propertyRepository.find();
    if (!propertys) {
      throw new NotFoundException('no propertys founded in this neighborhood');
    }
    return {
      propertys,
    };
  }

  async findOneProperty(id: number): Promise<{ property: Property }> {
    const property = await this.propertyRepository.findOne({
      where: { property_id: id },
      relations: ['user'],
    });
    if (!property) {
      throw new NotFoundException('property not found');
    }

    return {
      property,
    };
  }
  // Update property
  async updateProperty(id: number, updatePropertyDto: UpdatePropertyDto) {
    const property = await this.propertyRepository.findOneBy({
      property_id: id,
    });
    if (!property) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }

    if (updatePropertyDto.neighborhood_id) {
      const neighborhood = await this.neighborhoodRepository.findOneBy({
        neighborhood_id: updatePropertyDto.neighborhood_id,
      });
      if (!neighborhood) {
        throw new NotFoundException(
          `Neighborhood with ID ${updatePropertyDto.neighborhood_id} not found`,
        );
      }
      property.neighborhood = neighborhood;
    }

    const propertyExist = await this.propertyRepository.findOne({
      where: {
        title: updatePropertyDto.title,
        neighborhood: { neighborhood_id: updatePropertyDto.neighborhood_id },
      },
    });
    if (propertyExist) {
      throw new BadGatewayException(
        'property already exist in this neighborhood according to his title , please change title',
      );
    }

    Object.assign(property, updatePropertyDto);

    return this.propertyRepository.save(property);
  }
  // Delete property files
  async deletePropertyFiles(id: number, filesIds: number[]) {
    const property = await this.propertyRepository.findOne({
      where: { property_id: id },
    });
    if (!property) {
      throw new NotFoundException('property not found');
    }
    for (const fileId of filesIds) {
      const media = await this.propertyMediaRepository.findOne({
        where: { media_id: fileId, property: { property_id: id } },
      });
      if (!media) {
        throw new NotFoundException(
          `media with id ${fileId} not found for property ${id}`,
        );
      }

      await this.cloudinaryService.deleteImageFromCloudinary(media.public_id);
    }

    await this.propertyMediaRepository.delete(filesIds);
    return {
      message: 'media deleted successfully',
    };
  }
  // Delete property
  async removeProperty(id: number) {
    const property = await this.propertyRepository.findOne({
      where: { property_id: id },
      relations: ['user'],
    });
    if (!property) throw new NotFoundException('property not found');

    await this.propertyRepository.remove(property);
    return {
      message: 'property deleted sucessfully',
    };
  }
}
