import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { User } from '../user/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { Response } from 'express';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<User>;
    login(loginDto: LoginDto, res: Response): Promise<{
        refreshToken: string;
    }>;
    refreshToken(refreshTokenDto: RefreshTokenDto, res: Response): Promise<{
        refreshToken: string;
    }>;
    logout(refreshTokenDto: RefreshTokenDto, res: Response): Promise<{
        message: string;
    }>;
}
