// src/main.ts

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Request, Response } from 'express';
import {
  ArgumentsHost,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
  ValidationPipe,
  INestApplication,
} from '@nestjs/common';

// **** العودة إلى default import
import dotenv from 'dotenv';
dotenv.config();

// **** العودة إلى default import
import cookieParser from 'cookie-parser';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { ExpressAdapter } from '@nestjs/platform-express';

// **** العودة إلى default import
import express from 'express'; // <--- هنا التعديل الرئيسي

const logger = new Logger('Bootstrap');

export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal Server Error';

    logger.error(
      `[${request.method}] ${request.url} - Status: ${status} - Message: ${JSON.stringify(message)}`,
      exception.stack,
    );

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: typeof message === 'object' ? (message as any).message : message,
    });
  }
}

let cachedApp: INestApplication;

async function bootstrap() {
  if (!cachedApp) {
    // **** استخدام express() مباشرة
    const expressApp = express(); // <--- هنا التعديل

    const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));

    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    app.use(helmet());
    app.enableCors({
      origin: true,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    });
    // **** استخدام cookieParser() مباشرة
    app.use(cookieParser()); // <--- هنا التعديل

    const swagger = new DocumentBuilder()
      .setTitle('Nestjs-real-state-application')
      .addServer(process.env.NODE_ENV === 'production' 
        ? process.env.VERCEL_URL || 'https://real-state-project-nestjs.vercel.app'
        : 'http://localhost:3000')
      .setVersion('1.0')
      .addSecurity('bearer', { type: 'http', scheme: 'bearer' })
      .addBearerAuth()
      .build();
    const documentation = SwaggerModule.createDocument(app, swagger);
    SwaggerModule.setup('swagger', app, documentation);

    cachedApp = app;
  }
  return cachedApp;
}

export default async function handler(req: any, res: any) {
  const app = await bootstrap();
  const instance = app.getHttpAdapter().getInstance();
  await app.listen(0); 
  return instance(req, res);
}

// هذا الجزء هو لتشغيل التطبيق محليًا
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