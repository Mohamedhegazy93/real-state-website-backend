import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import * as dotenv from 'dotenv';
import { UserRole } from '../../user/entities/user.entity';
dotenv.config();

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request); 
    if (!token) {
      throw new UnauthorizedException('you dont have token');
    }
    try {
      const payload = await this.jwtService.verifyAsync(
        token,
        {
          secret: process.env.JWT_SECRET,
        },
      );

      request['user'] = payload;
      const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>('roles', [
        context.getHandler(),
        context.getClass(),
      ]);

    
      if (requiredRoles && !requiredRoles.includes(payload.role)) {
        throw new UnauthorizedException('Access denied');
      }

      return true;

    } catch {
      throw new UnauthorizedException('token invalid role');
    }
    return true;
  }

  private extractToken(request: Request): string | undefined {
    const cookieToken = request.cookies?.accessToken;
    return cookieToken;
  }
}