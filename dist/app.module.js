"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const typeorm_1 = require("@nestjs/typeorm");
const core_1 = require("@nestjs/core");
const user_module_1 = require("./user/user.module");
const city_module_1 = require("./city/city.module");
const neighborhood_module_1 = require("./neighborhood/neighborhood.module");
const property_module_1 = require("./property/property.module");
const media_module_1 = require("./media/media.module");
const config_1 = require("@nestjs/config");
const dotenv = require("dotenv");
const uploads_module_1 = require("./uploads/uploads.module");
const cloudinary_module_1 = require("./cloudinary/cloudinary.module");
const platform_express_1 = require("@nestjs/platform-express");
const auth_module_1 = require("./auth/auth.module");
const http_logger_middleware_1 = require("./middlewares/http-logger.middleware");
const throttler_1 = require("@nestjs/throttler");
dotenv.config();
let AppModule = class AppModule {
    configure(consumer) {
        consumer
            .apply(http_logger_middleware_1.HttpLoggerMiddleware)
            .forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            platform_express_1.MulterModule.register({ dest: './images' }),
            cloudinary_module_1.CloudinaryModule,
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                host: process.env.POSTGRES_HOST || process.env.DB_HOST,
                port: parseInt(process.env.POSTGRES_PORT || '5432'),
                username: process.env.POSTGRES_USER || process.env.DB_USERNAME,
                password: process.env.POSTGRES_PASSWORD || process.env.DB_PASSWORD,
                database: process.env.POSTGRES_DATABASE || process.env.DB_DATABASE,
                entities: [__dirname + '/**/*.entity{.ts,.js}'],
                synchronize: process.env.NODE_ENV !== 'production',
                ssl: {
                    rejectUnauthorized: false
                }
            }),
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
                ignoreEnvFile: process.env.NODE_ENV === 'production'
            }),
            uploads_module_1.UploadsModule,
            user_module_1.UserModule,
            city_module_1.CityModule,
            neighborhood_module_1.NeighborhoodModule,
            property_module_1.PropertyModule,
            media_module_1.MediaModule,
            cloudinary_module_1.CloudinaryModule,
            auth_module_1.AuthModule,
            throttler_1.ThrottlerModule.forRoot({
                throttlers: [
                    {
                        ttl: 60000,
                        limit: 10,
                    },
                ],
            }),
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService,
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: common_1.ClassSerializerInterceptor
            },
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard
            }
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map