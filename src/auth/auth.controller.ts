import { Body, Controller, Get, HttpCode, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { LoginUserDto } from './dto';
import { AuthService } from './auth.service';
import { ApiResponse, Tokens } from '@Types';
import { GetCurrentUserId, Public } from '../common/decorators';
import { UserDataResponse } from '../types/auth/response.type';
import { AtGuard, RtGuard } from '../common/guards';
import { Cookies } from '../common/decorators/cookie.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginData: LoginUserDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<ApiResponse<UserDataResponse>> {
    return await this.authService.login(loginData, response);
  }

  @UseGuards(AtGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@GetCurrentUserId() id: string): Promise<any> {
    return this.authService.logout(id);
  }

  @Public()
  @UseGuards(RtGuard)
  @Get('user')
  @HttpCode(HttpStatus.FOUND)
  getUserInfo(@Cookies('jwt-refresh') rt: string): Promise<ApiResponse<UserDataResponse>> {
    return this.authService.getUserInfo(rt);
  }
  @Public()
  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshTokens(@Cookies('jwt-refresh') rt: string, @Res({ passthrough: true }) response: Response): Promise<Tokens> {
    return this.authService.refreshTokens(rt, response);
  }
}
