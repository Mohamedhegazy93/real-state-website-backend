import { Controller, Post, Body, UseGuards, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { User } from '../user/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AuthGuard } from './guards/auth.guard';
import { Response } from 'express';
import { ApiOperation } from '@nestjs/swagger';

const accessTokenCookieOptions = {
  httpOnly: true,
  secure: false,
  sameSite: 'strict' as 'strict' | 'lax' | 'none' | undefined,
  path: '/',
};

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // POST ~/auth/signup
  @Post('signup')
  @ApiOperation({ summary: 'Register a new user' })
  register(@Body() registerDto: RegisterDto): Promise<User> {
    return this.authService.register(registerDto);
  }

  // POST ~/auth/login
  @Post('login')
  @ApiOperation({ summary: 'Login an existing user and get access and refresh tokens' })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } =
      await this.authService.login(loginDto);
    // set cookies
    res.cookie('accessToken', accessToken, accessTokenCookieOptions);

    return { refreshToken };
  }

  // POST ~/auth/refresh
  @Post('refresh')
  @ApiOperation({ summary: 'Refresh the access token using a refresh token' })
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.refreshToken(
      refreshTokenDto.refreshToken,
    );
    // set cookies
    res.cookie('accessToken', accessToken, accessTokenCookieOptions);

    return { refreshToken };
  }

  // POST ~/auth/logout
  @Post('logout')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Logout the current user by invalidating the refresh token' })
  async logout(
    @Body() refreshTokenDto: RefreshTokenDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.logout(refreshTokenDto.refreshToken);
    // clear cookies
    res.clearCookie('accessToken');

    return { message: 'logged out successfully' };
  }
}