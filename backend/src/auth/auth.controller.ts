import { Body, Controller, Get, HttpCode, Patch, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { Throttle } from '@nestjs/throttler';
import { CurrentUser, SessionGuard, SessionUser } from '../common/auth';
import { AuthService } from './auth.service';
import { EmailDto, LoginDto, PasswordDto, ProfileDto, RegisterDto, ResetDto } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private service: AuthService) {}
  private cookie(response: Response, token: string) { response.cookie('omnaad_session', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 1000 * 60 * 60 * 24 * 7 }); }
  @Post('login') @HttpCode(200) @Throttle({ default: { limit: 5, ttl: 60_000 } }) async login(@Body() dto: LoginDto, @Res({ passthrough: true }) response: Response) { const result = await this.service.login(dto); this.cookie(response, result.token); return result.user; }
  @Post('register') @Throttle({ default: { limit: 5, ttl: 60_000 } }) async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) response: Response) { const result = await this.service.register(dto); this.cookie(response, result.token); return result.user; }
  @Post('logout') @HttpCode(204) logout(@Res({ passthrough: true }) response: Response) { response.clearCookie('omnaad_session'); }
  @Post('forgot-password') @Throttle({ default: { limit: 3, ttl: 60_000 } }) forgot(@Body() dto: EmailDto) { return this.service.forgot(dto); }
  @Post('reset-password') reset(@Body() dto: ResetDto) { return this.service.reset(dto); }
  @Get('me') @UseGuards(SessionGuard) me(@CurrentUser() user: SessionUser) { return user; }
  @Patch('profile') @UseGuards(SessionGuard) profile(@CurrentUser() user: SessionUser, @Body() dto: ProfileDto) { return this.service.updateProfile(user, dto); }
  @Patch('password') @UseGuards(SessionGuard) password(@CurrentUser() user: SessionUser, @Body() dto: PasswordDto) { return this.service.updatePassword(user, dto); }
}
