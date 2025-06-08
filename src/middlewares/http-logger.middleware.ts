import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class HttpLoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction) {
    const { method, originalUrl, ip } = request;
    const userAgent = request.get('user-agent') || '';
    const startTime = Date.now();
    const user = (request as any).user;

    console.log('Request User Object in Middleware:', user); 

    const userId = user ? user.id : 'Guest'; 

    response.on('finish', () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length');
      const processingTime = Date.now() - startTime;

      this.logger.log(
        `${method} ${originalUrl} ${statusCode} ${contentLength} - User ID: ${userId} - IP: ${ip} - User-Agent: ${userAgent} - Time: ${processingTime}ms`,
      );
    });

    next();
  }
}