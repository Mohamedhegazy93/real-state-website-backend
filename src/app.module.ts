import { ClassSerializerInterceptor, MiddlewareConsumer, Module, NestModule, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { UserModule } from './user/user.module';
import { CityModule } from './city/city.module';
import { NeighborhoodModule } from './neighborhood/neighborhood.module';
import { PropertyModule } from './property/property.module';
import { MediaModule } from './media/media.module';
import { ConfigModule } from '@nestjs/config';
import * as dotenv from 'dotenv'; 
import { UploadsModule } from './uploads/uploads.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { MulterModule } from '@nestjs/platform-express';
import { AuthModule } from './auth/auth.module';
import { HttpLoggerMiddleware } from './middlewares/http-logger.middleware';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
dotenv.config(); 
//comment


@Module({
  imports: [
    MulterModule.register({ dest: './images' }),
    CloudinaryModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST || process.env.DB_HOST,
      port: parseInt(process.env.POSTGRES_PORT || '5432'),
      username: process.env.POSTGRES_USER || process.env.DB_USERNAME,
      password: process.env.POSTGRES_PASSWORD || process.env.DB_PASSWORD,
      database: process.env.POSTGRES_DATABASE || process.env.DB_DATABASE,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: process.env.NODE_ENV !== 'production',
      ssl:{
        rejectUnauthorized:false
      }
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      ignoreEnvFile: process.env.NODE_ENV === 'production'
    }),
    UploadsModule,
    UserModule,
    CityModule,
    NeighborhoodModule,
    PropertyModule,
    MediaModule,
    CloudinaryModule,
    AuthModule,
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 10,
        },
      ],
    }),
    
    
  ],
  controllers: [AppController],
  providers: [AppService,

  
  {
    provide:APP_INTERCEPTOR,
    useClass:ClassSerializerInterceptor  //Exclude()
  },
  {
    provide: APP_GUARD,
    useClass: ThrottlerGuard
  }


],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(HttpLoggerMiddleware)
      .forRoutes('*'); // تطبيق الـ middleware على جميع المسارات
  }
}
