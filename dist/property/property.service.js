"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertyService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const property_entity_1 = require("./entities/property.entity");
const neighborhood_entity_1 = require("../neighborhood/entities/neighborhood.entity");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../user/entities/user.entity");
const media_entity_1 = require("../media/entities/media.entity");
const propertyMedia_entity_1 = require("../media/entities/propertyMedia.entity");
const cloudinary_service_1 = require("../cloudinary/cloudinary.service");
let PropertyService = class PropertyService {
    propertyRepository;
    neighborhoodRepository;
    userRepository;
    propertyMediaRepository;
    cloudinaryService;
    constructor(propertyRepository, neighborhoodRepository, userRepository, propertyMediaRepository, cloudinaryService) {
        this.propertyRepository = propertyRepository;
        this.neighborhoodRepository = neighborhoodRepository;
        this.userRepository = userRepository;
        this.propertyMediaRepository = propertyMediaRepository;
        this.cloudinaryService = cloudinaryService;
    }
    async createProperty(createPropertyDto, payload) {
        const { neighborhood_id, ...propertyData } = createPropertyDto;
        const neighborhood = await this.neighborhoodRepository.findOne({
            where: { neighborhood_id: neighborhood_id },
        });
        if (!neighborhood) {
            throw new common_1.NotFoundException(`Neighborhood with ID ${neighborhood_id} not found`);
        }
        const user = await this.userRepository.findOneBy({ id: payload.id });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID  not found`);
        }
        const propertyExist = await this.propertyRepository.findOne({
            where: {
                title: createPropertyDto.title,
                neighborhood: { neighborhood_id: createPropertyDto.neighborhood_id },
            },
        });
        if (propertyExist) {
            throw new common_1.BadGatewayException('property already exist in this neighborhood according to his title , please change title');
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
    async uploadPropertyFiles(id, files) {
        const property = await this.propertyRepository.findOne({
            where: { property_id: id },
        });
        if (!property) {
            throw new common_1.NotFoundException('property not found');
        }
        if (files && files.length > 0) {
            const results = await this.cloudinaryService.uploadFiles(files);
            for (const result of results) {
                const media = this.propertyMediaRepository.create({
                    media_type: media_entity_1.MediaType.IMAGE,
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
        throw new common_1.BadRequestException('no files provided');
    }
    async findPropertyFiles(id) {
        const property = await this.propertyRepository.findOne({
            where: { property_id: id },
        });
        if (!property) {
            throw new common_1.NotFoundException('property not found');
        }
        const propertyFiles = await this.propertyMediaRepository.find({
            where: { property: { property_id: id } },
        });
        if (propertyFiles && propertyFiles.length > 0) {
            return {
                propertyFiles,
            };
        }
        throw new common_1.NotFoundException('no media for this property');
    }
    async findAllProperties() {
        const propertys = await this.propertyRepository.find();
        if (!propertys) {
            throw new common_1.NotFoundException('no propertys founded in this neighborhood');
        }
        return {
            propertys,
        };
    }
    async findOneProperty(id) {
        const property = await this.propertyRepository.findOne({
            where: { property_id: id },
            relations: ['user'],
        });
        if (!property) {
            throw new common_1.NotFoundException('property not found');
        }
        return {
            property,
        };
    }
    async updateProperty(id, updatePropertyDto) {
        const property = await this.propertyRepository.findOneBy({
            property_id: id,
        });
        if (!property) {
            throw new common_1.NotFoundException(`Property with ID ${id} not found`);
        }
        if (updatePropertyDto.neighborhood_id) {
            const neighborhood = await this.neighborhoodRepository.findOneBy({
                neighborhood_id: updatePropertyDto.neighborhood_id,
            });
            if (!neighborhood) {
                throw new common_1.NotFoundException(`Neighborhood with ID ${updatePropertyDto.neighborhood_id} not found`);
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
            throw new common_1.BadGatewayException('property already exist in this neighborhood according to his title , please change title');
        }
        Object.assign(property, updatePropertyDto);
        return this.propertyRepository.save(property);
    }
    async deletePropertyFiles(id, filesIds) {
        const property = await this.propertyRepository.findOne({
            where: { property_id: id },
        });
        if (!property) {
            throw new common_1.NotFoundException('property not found');
        }
        for (const fileId of filesIds) {
            const media = await this.propertyMediaRepository.findOne({
                where: { media_id: fileId, property: { property_id: id } },
            });
            if (!media) {
                throw new common_1.NotFoundException(`media with id ${fileId} not found for property ${id}`);
            }
            await this.cloudinaryService.deleteImageFromCloudinary(media.public_id);
        }
        await this.propertyMediaRepository.delete(filesIds);
        return {
            message: 'media deleted successfully',
        };
    }
    async removeProperty(id) {
        const property = await this.propertyRepository.findOne({
            where: { property_id: id },
            relations: ['user'],
        });
        if (!property)
            throw new common_1.NotFoundException('property not found');
        await this.propertyRepository.remove(property);
        return {
            message: 'property deleted sucessfully',
        };
    }
};
exports.PropertyService = PropertyService;
exports.PropertyService = PropertyService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(property_entity_1.Property)),
    __param(1, (0, typeorm_1.InjectRepository)(neighborhood_entity_1.Neighborhood)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(3, (0, typeorm_1.InjectRepository)(propertyMedia_entity_1.PropertyMedia)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        cloudinary_service_1.CloudinaryService])
], PropertyService);
//# sourceMappingURL=property.service.js.map