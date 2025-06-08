import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { MoreThan, Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RefreshToken } from './entities/refresh-token.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
  ) {}
  // REGISTER
  async register(registerDto: RegisterDto) {
    const { email, phoneNumber } = registerDto;
    const userExist = await this.userRepository.findOne({
      where: { email: email },
    });
    if (userExist) {
      throw new BadRequestException('User with this email already exists');
    }
    if (phoneNumber) {
      const phoneExist = await this.userRepository.findOne({
        where: { phoneNumber: phoneNumber },
      });
      if (phoneExist)
        throw new BadRequestException('this phone number already exists');
    }
    const newUser = this.userRepository.create(registerDto);
    const savedUser = await this.userRepository.save(newUser);
    return savedUser;
  }
  // LOGIN
  async login(loginDto: LoginDto) {
    // check user info
    const { email, password } = loginDto;
    const user = await this.userRepository.findOne({
      where: { email },
    });
    if (!user) {
      throw new UnauthorizedException('please resgister first');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('incorrect email or password');
    }
    // generate tokens
    return this.generateToken(user);
  }
  // REFRESH TOKEN
  async refreshToken(refreshToken: string) {
    const token = await this.refreshTokenRepository.findOne({
      where: { refreshToken: refreshToken, expiresAt: MoreThan(new Date()) },
      relations: ['user'],
    });
    if (!token) {
      throw new UnauthorizedException(
        'refresh token is invaild or user not found',
      );
    }
    // remove invaild token
    await this.refreshTokenRepository.remove(token);
    // generate new tokens
    return this.generateToken(token.user);
  }
  async logout(refreshToken: string) {
    const token = await this.refreshTokenRepository.findOne({
      where: { refreshToken },
    });

    if (token) {
      await this.refreshTokenRepository.remove(token);
      return { message: 'Logged out successfully' };
    } else {
      throw new BadRequestException('Refresh token not found');
    }
  }

  // @/Functions/@

  // Store refreshtoken in DB
  async storeRefreshToken(refreshToken: string, userId: number) {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    const existingRefreshToken = await this.refreshTokenRepository.findOne({
      where: { userId: userId },
    });
    const createRefreshToken = this.refreshTokenRepository.create({
      refreshToken,
      userId,
      expiresAt,
    });

    if (existingRefreshToken) {
      await this.refreshTokenRepository.remove(existingRefreshToken);
      await this.refreshTokenRepository.save(createRefreshToken);
    } else {
      await this.refreshTokenRepository.save(createRefreshToken);
    }
  }
  // Generate tokens for user
  async generateToken(user: User) {
    const payload = { id: user.id, role: user.role};

    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.REFRESH_TOKEN_SECRET,
      expiresIn: '7d',
    });
    await this.storeRefreshToken(refreshToken, user.id);

    return { accessToken, refreshToken };
  }
}
