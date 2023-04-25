import { Body, Controller, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Response, Request } from 'express';
import { LoginUserDto } from './dto';
import { AuthService } from './auth.service';
import { Tokens } from '@Types';
import { GetCurrentUser, GetCurrentUserId, Public } from '../common/decorators';
import { ResponseDataToFront } from '../types/auth/response-data.type';
import { RtGuard } from '../common/guards';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginData: LoginUserDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<ResponseDataToFront> {
    const userData = await this.authService.login(loginData, response);
    return {
      id: userData.id,
      email: userData.email,
      role: userData.role,
      name: userData.name,
      fullName: userData.fullName,
      firstName: userData.firstName,
      lastName: userData.lastName,
      access_token: userData.access_token,
    };
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  logout(@GetCurrentUserId() id: string): Promise<any> {
    return this.authService.logout(id);
  }

  @Public()
  // @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshTokens(
    // @GetCurrentUserId() id: string,
    // @GetCurrentUser('refreshToken') refreshToken: string,
    @Req() request: Request,
  ): Promise<Tokens> {
    return this.authService.refreshTokens(request);
  }
}
