import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { RefreshToken } from './entities/refresh-token.entity';
export declare class AuthService {
    private readonly userRepository;
    private readonly jwtService;
    private readonly refreshTokenRepository;
    constructor(userRepository: Repository<User>, jwtService: JwtService, refreshTokenRepository: Repository<RefreshToken>);
    register(registerDto: RegisterDto): Promise<User>;
    login(loginDto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    refreshToken(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(refreshToken: string): Promise<{
        message: string;
    }>;
    storeRefreshToken(refreshToken: string, userId: number): Promise<void>;
    generateToken(user: User): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
}
