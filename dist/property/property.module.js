"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertyModule = void 0;
const common_1 = require("@nestjs/common");
const property_service_1 = require("./property.service");
const property_controller_1 = require("./property.controller");
const typeorm_1 = require("@nestjs/typeorm");
const property_entity_1 = require("./entities/property.entity");
const user_entity_1 = require("../user/entities/user.entity");
const neighborhood_entity_1 = require("../neighborhood/entities/neighborhood.entity");
const media_entity_1 = require("../media/entities/media.entity");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const propertyMedia_entity_1 = require("../media/entities/propertyMedia.entity");
const cloudinary_module_1 = require("../cloudinary/cloudinary.module");
const cloudinary_service_1 = require("../cloudinary/cloudinary.service");
const auth_module_1 = require("../auth/auth.module");
const user_service_1 = require("../user/user.service");
let PropertyModule = class PropertyModule {
};
exports.PropertyModule = PropertyModule;
exports.PropertyModule = PropertyModule = __decorate([
    (0, common_1.Module)({
        imports: [auth_module_1.AuthModule,
            typeorm_1.TypeOrmModule.forFeature([property_entity_1.Property, user_entity_1.User, neighborhood_entity_1.Neighborhood, media_entity_1.Media, propertyMedia_entity_1.PropertyMedia]), cloudinary_module_1.CloudinaryModule,
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
                    if (file.mimetype.startsWith('image') ||
                        file.mimetype.startsWith('video')) {
                        cb(null, true);
                    }
                    else {
                        cb(new common_1.BadRequestException('unsupported file format'), false);
                    }
                },
                limits: {
                    fileSize: 200 * 1024 * 1024,
                },
            }),
        ],
        controllers: [property_controller_1.PropertyController],
        providers: [property_service_1.PropertyService, cloudinary_service_1.CloudinaryService, user_service_1.UserService],
    })
], PropertyModule);
//# sourceMappingURL=property.module.js.map