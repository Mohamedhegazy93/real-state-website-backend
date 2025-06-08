"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalExceptionFilter = void 0;
exports.default = handler;
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const dotenv = require("dotenv");
dotenv.config();
const cookieParser = require("cookie-parser");
const swagger_1 = require("@nestjs/swagger");
const helmet_1 = require("helmet");
const platform_express_1 = require("@nestjs/platform-express");
const express = require("express");
const logger = new common_1.Logger('Bootstrap');
class GlobalExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status = exception instanceof common_1.HttpException
            ? exception.getStatus()
            : common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        const message = exception instanceof common_1.HttpException
            ? exception.getResponse()
            : 'Internal Server Error';
        logger.error(`[${request.method}] ${request.url} - Status: ${status} - Message: ${JSON.stringify(message)}`, exception.stack);
        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            message: typeof message === 'object' ? message.message : message,
        });
    }
}
exports.GlobalExceptionFilter = GlobalExceptionFilter;
let cachedApp;
async function bootstrap() {
    if (!cachedApp) {
        const expressApp = express();
        const app = await core_1.NestFactory.create(app_module_1.AppModule, new platform_express_1.ExpressAdapter(expressApp));
        app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true }));
        app.use((0, helmet_1.default)());
        app.enableCors({
            origin: true,
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
        });
        app.use(cookieParser());
        const swagger = new swagger_1.DocumentBuilder()
            .setTitle('Nestjs-real-state-application')
            .addServer(process.env.NODE_ENV === 'production'
            ? process.env.VERCEL_URL || 'https://real-state-project-nestjs.vercel.app'
            : 'http://localhost:3000')
            .setVersion('1.0')
            .addSecurity('bearer', { type: 'http', scheme: 'bearer' })
            .addBearerAuth()
            .build();
        const documentation = swagger_1.SwaggerModule.createDocument(app, swagger);
        swagger_1.SwaggerModule.setup('swagger', app, documentation);
        cachedApp = app;
    }
    return cachedApp;
}
async function handler(req, res) {
    const app = await bootstrap();
    const instance = app.getHttpAdapter().getInstance();
    await app.listen(0);
    return instance(req, res);
}
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL_ENV) {
    bootstrap().then(app => {
        const port = process.env.PORT || 3000;
        const expressApp = app.getHttpAdapter().getInstance();
        expressApp.listen(port, () => {
            logger.log(`Application is running on: http://localhost:${port}`);
        });
    }).catch(err => {
        logger.error('Error starting local application:', err);
        process.exit(1);
    });
}
//# sourceMappingURL=main.js.map