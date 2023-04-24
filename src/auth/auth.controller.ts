import { Body, Controller, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { LoginUserDto } from './dto';
import { AuthService } from './auth.service';
import { Tokens } from '@Types';
import { GetCurrentUser, GetCurrentUserId, Public } from '../common/decorators';
import { ResponseData } from '../types/auth/response-data.type';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // @Public()
  // @Post('login')
  // @HttpCode(HttpStatus.OK)
  // async login(@Body() login: LoginUserDto): Promise<Tokens> {
  //   return this.authService.login(login);
  // }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() login: LoginUserDto, @Res({ passthrough: true }) response: Response): Promise<ResponseData> {
    const result = await this.authService.login(login);
    response.cookie('jwt', result, { httpOnly: true });
    return result;
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshTokens(@GetCurrentUserId() id: string, @GetCurrentUser('refreshToken') refreshToken: string): Promise<Tokens> {
    return this.authService.refreshTokens(id, refreshToken);
  }
}
