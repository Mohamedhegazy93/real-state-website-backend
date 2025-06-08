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
exports.CityService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const city_entity_1 = require("./entities/city.entity");
const typeorm_2 = require("typeorm");
const cityMedia_entity_1 = require("../media/entities/cityMedia.entity");
const cloudinary_service_1 = require("../cloudinary/cloudinary.service");
const media_entity_1 = require("../media/entities/media.entity");
let CityService = class CityService {
    cityRepository;
    cityMediaRepository;
    cloudinaryService;
    constructor(cityRepository, cityMediaRepository, cloudinaryService) {
        this.cityRepository = cityRepository;
        this.cityMediaRepository = cityMediaRepository;
        this.cloudinaryService = cloudinaryService;
    }
    async create(createCityDto) {
        const cityFind = await this.cityRepository.findOneBy({
            city_name: createCityDto.city_name,
        });
        if (cityFind)
            throw new common_1.BadRequestException('city already exist');
        const city = this.cityRepository.create(createCityDto);
        await this.cityRepository.save(city);
        return {
            message: 'city created sucessfully',
            city,
        };
    }
    async uploadCityImages(id, files) {
        const city = await this.cityRepository.findOne({ where: { city_id: id } });
        if (!city) {
            throw new common_1.NotFoundException('city not found');
        }
        if (files && files.length > 0) {
            const results = await this.cloudinaryService.uploadFiles(files);
            console.log(results);
            for (const result of results) {
                const media = this.cityMediaRepository.create({
                    media_type: media_entity_1.MediaType.IMAGE,
                    media_url: result.secure_url,
                    public_id: result.public_id,
                    city: city,
                });
                await this.cityMediaRepository.save(media);
            }
            return { message: 'all images uploded sucessfully' };
        }
        throw new common_1.NotFoundException('no imags provided');
    }
    async deleteCityImages(id, filesIds) {
        const city = await this.cityRepository.findOne({
            where: { city_id: id },
        });
        if (!city) {
            throw new common_1.NotFoundException('city not found');
        }
        if (!Array.isArray(filesIds) || filesIds.length === 0) {
            throw new common_1.BadRequestException('Files IDs must be an array and cannot be empty.');
        }
        for (const fileId of filesIds) {
            const media = await this.cityMediaRepository.findOne({
                where: { media_id: fileId, city: { city_id: id } },
            });
            if (!media) {
                throw new common_1.NotFoundException(`file with id ${fileId} not found for property ${id}`);
            }
            await this.cloudinaryService.deleteImageFromCloudinary(media.public_id);
        }
        await this.cityMediaRepository.delete(filesIds);
        return {
            message: 'media deleted successfully',
        };
    }
    async getAllcities(city_name) {
        const filters = {
            ...(city_name ? { city_name: (0, typeorm_2.Like)(`%${city_name}%`) } : {}),
        };
        const cities = await this.cityRepository.find({
            where: filters,
            relations: ['neighborhoods']
        });
        return {
            length: cities.length,
            cities,
        };
    }
    async findCity(id) {
        const city = await this.cityRepository.findOne({ where: { city_id: id }, relations: ['neighborhoods'] });
        if (!city)
            throw new common_1.NotFoundException(`no city for ${id} id`);
        return {
            city,
        };
    }
    async updateCity(id, updateCityDto) {
        const city = await this.cityRepository.findOne({ where: { city_id: id } });
        if (!city)
            throw new common_1.NotFoundException(`no city for ${id} id`);
        const existCity = await this.cityRepository.findOne({
            where: { city_name: updateCityDto.city_name },
        });
        if (existCity && existCity.city_id !== id) {
            throw new common_1.BadRequestException('city already exist');
        }
        this.cityRepository.merge(city, updateCityDto);
        await this.cityRepository.save(city);
        return {
            message: 'city updated sucessfully',
            city,
        };
    }
    async remove(id) {
        const city = await this.cityRepository.findOne({ where: { city_id: id } });
        if (!city)
            throw new common_1.NotFoundException(`no city for ${id} id`);
        try {
            await this.cityRepository.remove(city);
            return {
                message: 'city deleted sucessfully',
            };
        }
        catch (error) {
            if (error.message.includes('violates foreign key constraint')) {
                throw new common_1.BadRequestException(error.message);
            }
            throw error;
        }
    }
};
exports.CityService = CityService;
exports.CityService = CityService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(city_entity_1.City)),
    __param(1, (0, typeorm_1.InjectRepository)(cityMedia_entity_1.CityMedia)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        cloudinary_service_1.CloudinaryService])
], CityService);
//# sourceMappingURL=city.service.js.map