"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../user/entities/user.entity");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcrypt");
const jwt_1 = require("@nestjs/jwt");
const refresh_token_entity_1 = require("./entities/refresh-token.entity");
let AuthService = class AuthService {
    userRepository;
    jwtService;
    refreshTokenRepository;
    constructor(userRepository, jwtService, refreshTokenRepository) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.refreshTokenRepository = refreshTokenRepository;
    }
    async register(registerDto) {
        const { email, phoneNumber } = registerDto;
        const userExist = await this.userRepository.findOne({
            where: { email: email },
        });
        if (userExist) {
            throw new common_1.BadRequestException('User with this email already exists');
        }
        if (phoneNumber) {
            const phoneExist = await this.userRepository.findOne({
                where: { phoneNumber: phoneNumber },
            });
            if (phoneExist)
                throw new common_1.BadRequestException('this phone number already exists');
        }
        const newUser = this.userRepository.create(registerDto);
        const savedUser = await this.userRepository.save(newUser);
        return savedUser;
    }
    async login(loginDto) {
        const { email, password } = loginDto;
        const user = await this.userRepository.findOne({
            where: { email },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('please resgister first');
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new common_1.UnauthorizedException('incorrect email or password');
        }
        return this.generateToken(user);
    }
    async refreshToken(refreshToken) {
        const token = await this.refreshTokenRepository.findOne({
            where: { refreshToken: refreshToken, expiresAt: (0, typeorm_2.MoreThan)(new Date()) },
            relations: ['user'],
        });
        if (!token) {
            throw new common_1.UnauthorizedException('refresh token is invaild or user not found');
        }
        await this.refreshTokenRepository.remove(token);
        return this.generateToken(token.user);
    }
    async logout(refreshToken) {
        const token = await this.refreshTokenRepository.findOne({
            where: { refreshToken },
        });
        if (token) {
            await this.refreshTokenRepository.remove(token);
            return { message: 'Logged out successfully' };
        }
        else {
            throw new common_1.BadRequestException('Refresh token not found');
        }
    }
    async storeRefreshToken(refreshToken, userId) {
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
        }
        else {
            await this.refreshTokenRepository.save(createRefreshToken);
        }
    }
    async generateToken(user) {
        const payload = { id: user.id, role: user.role };
        const accessToken = await this.jwtService.signAsync(payload);
        const refreshToken = await this.jwtService.signAsync(payload, {
            secret: process.env.REFRESH_TOKEN_SECRET,
            expiresIn: '7d',
        });
        await this.storeRefreshToken(refreshToken, user.id);
        return { accessToken, refreshToken };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(refresh_token_entity_1.RefreshToken)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService,
        typeorm_2.Repository])
], AuthService);
//# sourceMappingURL=auth.service.js.map