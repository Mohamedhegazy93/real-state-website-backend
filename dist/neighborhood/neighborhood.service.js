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
exports.NeighborhoodService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const neighborhood_entity_1 = require("./entities/neighborhood.entity");
const typeorm_2 = require("typeorm");
const city_entity_1 = require("../city/entities/city.entity");
const neighborhoodMedia_entity_1 = require("../media/entities/neighborhoodMedia.entity");
const cloudinary_service_1 = require("../cloudinary/cloudinary.service");
const media_entity_1 = require("../media/entities/media.entity");
let NeighborhoodService = class NeighborhoodService {
    neighborhoodRepository;
    cityRepository;
    neighborhoodMediaRepository;
    cloudinaryService;
    constructor(neighborhoodRepository, cityRepository, neighborhoodMediaRepository, cloudinaryService) {
        this.neighborhoodRepository = neighborhoodRepository;
        this.cityRepository = cityRepository;
        this.neighborhoodMediaRepository = neighborhoodMediaRepository;
        this.cloudinaryService = cloudinaryService;
    }
    async create(createNeighborhoodDto) {
        const city = await this.cityRepository.findOne({
            where: { city_id: createNeighborhoodDto.city_id },
        });
        if (!city) {
            throw new common_1.NotFoundException('City not found');
        }
        const existingNeighborhood = await this.neighborhoodRepository.findOne({
            where: {
                neighborhood_name: createNeighborhoodDto.neighborhood_name,
                city: { city_id: createNeighborhoodDto.city_id },
            },
        });
        if (existingNeighborhood) {
            throw new common_1.BadRequestException('Neighborhood already exists in this city');
        }
        const neighborhood = this.neighborhoodRepository.create({
            neighborhood_name: createNeighborhoodDto.neighborhood_name,
            city: city,
        });
        await this.neighborhoodRepository.save(neighborhood);
        return {
            message: 'Neighborhood created successfully',
            neighborhood,
        };
    }
    async uploadNeighborhoodImages(id, files) {
        const neigbohood = await this.neighborhoodRepository.findOne({
            where: { neighborhood_id: id },
        });
        if (!neigbohood) {
            throw new common_1.NotFoundException('neighborhood not found');
        }
        if (files && files.length > 0) {
            const results = await this.cloudinaryService.uploadFiles(files);
            console.log(results);
            for (const result of results) {
                const media = this.neighborhoodMediaRepository.create({
                    media_type: media_entity_1.MediaType.IMAGE,
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
        throw new common_1.BadRequestException('no files provided');
    }
    async deleteNeighborhoodImages(id, filesIds) {
        const neighborhood = await this.neighborhoodRepository.findOne({
            where: { neighborhood_id: id },
        });
        if (!neighborhood) {
            throw new common_1.NotFoundException('neighborhood not found');
        }
        for (const fileId of filesIds) {
            const media = await this.neighborhoodMediaRepository.findOne({
                where: { media_id: fileId, neighborhood: { neighborhood_id: id } },
            });
            if (!media) {
                throw new common_1.NotFoundException(`file with id ${fileId} not found for neighborhood ${id}`);
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
        if (!neighborhoods)
            throw new common_1.NotFoundException();
        return {
            length: neighborhoods.length,
            neighborhoods,
        };
    }
    async findNeighborhoodsOfCity(city_id) {
        const city = await this.cityRepository.findOne({
            where: { city_id: city_id },
        });
        if (!city)
            throw new common_1.NotFoundException('city not found');
        const neigbohoods = await this.neighborhoodRepository.find({
            where: { city: { city_id: city_id } },
        });
        if (!neigbohoods)
            throw new common_1.NotFoundException(`no neigbohoods founded in ${city.city_name} yet`);
        return {
            length: neigbohoods.length,
            neigbohoods,
        };
    }
    async findOne(id) {
        const neighborhood = await this.neighborhoodRepository.findOne({
            where: { neighborhood_id: id },
            relations: ['city'],
        });
        if (!neighborhood)
            throw new common_1.NotFoundException();
        return {
            neighborhood,
        };
    }
    async update(id, updateNeighborhoodDto) {
        const neighborhood = await this.neighborhoodRepository.findOne({
            where: { neighborhood_id: id },
        });
        if (!neighborhood)
            throw new common_1.NotFoundException();
        if (updateNeighborhoodDto.city_id) {
            const city = await this.neighborhoodRepository.findOne({
                where: { city: { city_id: updateNeighborhoodDto.city_id } },
            });
            if (!city)
                throw new common_1.NotFoundException('city not found');
        }
        const existingNeighborhood = await this.neighborhoodRepository.findOne({
            where: {
                neighborhood_name: updateNeighborhoodDto.neighborhood_name,
                city: { city_id: updateNeighborhoodDto.city_id },
            },
        });
        if (existingNeighborhood && existingNeighborhood.neighborhood_id !== id) {
            throw new common_1.BadRequestException('Neighborhood already exists in this city');
        }
        if (updateNeighborhoodDto.neighborhood_name !== undefined) {
            neighborhood.neighborhood_name = updateNeighborhoodDto.neighborhood_name;
        }
        if (updateNeighborhoodDto.city_id !== undefined) {
            const city = await this.cityRepository.findOne({
                where: { city_id: updateNeighborhoodDto.city_id },
            });
            if (!city) {
                throw new common_1.NotFoundException('city not found');
            }
            neighborhood.city = city;
        }
        await this.neighborhoodRepository.save(neighborhood);
        return {
            messgae: 'neighborhood updated sucessfully',
            neighborhood,
        };
    }
    async remove(id) {
        const neighborhood = await this.neighborhoodRepository.findOne({
            where: { neighborhood_id: id },
        });
        if (!neighborhood)
            throw new common_1.NotFoundException('neighborhood not found');
        try {
            await this.neighborhoodRepository.remove(neighborhood);
            return {
                message: 'neighborhood deleted sucessfully',
            };
        }
        catch (error) {
            if (error.message.includes('violates foreign key constraint')) {
                throw new common_1.BadRequestException('can not delete this neighborhood because it has related property');
            }
            throw error;
        }
    }
};
exports.NeighborhoodService = NeighborhoodService;
exports.NeighborhoodService = NeighborhoodService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(neighborhood_entity_1.Neighborhood)),
    __param(1, (0, typeorm_1.InjectRepository)(city_entity_1.City)),
    __param(2, (0, typeorm_1.InjectRepository)(neighborhoodMedia_entity_1.NeighborhoodMedia)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        cloudinary_service_1.CloudinaryService])
], NeighborhoodService);
//# sourceMappingURL=neighborhood.service.js.map