"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CityModule = void 0;
const common_1 = require("@nestjs/common");
const city_service_1 = require("./city.service");
const city_controller_1 = require("./city.controller");
const typeorm_1 = require("@nestjs/typeorm");
const city_entity_1 = require("./entities/city.entity");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const media_entity_1 = require("../media/entities/media.entity");
const cityMedia_entity_1 = require("../media/entities/cityMedia.entity");
const cloudinary_module_1 = require("../cloudinary/cloudinary.module");
const cloudinary_service_1 = require("../cloudinary/cloudinary.service");
let CityModule = class CityModule {
};
exports.CityModule = CityModule;
exports.CityModule = CityModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([city_entity_1.City, media_entity_1.Media, cityMedia_entity_1.CityMedia]), cloudinary_module_1.CloudinaryModule,
            platform_express_1.MulterModule.register({
                storage: (0, multer_1.diskStorage)({
                    destination: './images',
                    filename: (req, file, cb) => {
                        const prefix = `${Date.now()}-${Math.round(Math.random() * 1000000)}`;
                        const filename = `${prefix}-${file.originalname}`;
                        cb(null, filename);
                    },
                }),
                fileFilter: (req, file, cb) => {
                    if (file.mimetype.startsWith('image')) {
                        cb(null, true);
                    }
                    else {
                        cb(new common_1.BadRequestException('unsupported file format'), false);
                    }
                },
                limits: {
                    fileSize: 5 * 1024 * 1024,
                },
            }),
        ],
        controllers: [city_controller_1.CityController],
        providers: [city_service_1.CityService, cloudinary_service_1.CloudinaryService],
    })
], CityModule);
//# sourceMappingURL=city.module.js.map