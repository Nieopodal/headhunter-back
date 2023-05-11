import { Body, Controller, Get, HttpCode, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { LoginUserDto } from './dto';
import { AuthService } from './auth.service';
import { ApiResponse, RecoveryPasswordResponse, Tokens } from '@Types';
import { GetCurrentUserId, Public } from '../common/decorators';
import { UserDataResponse } from '@Types';
import { AtGuard, RtGuard } from '../common/guards';
import { Cookies } from '../common/decorators/cookie.decorator';
import { RecoveryPasswordDto } from './dto/recovery-password.dto';

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
  @Post('*/password/*')
  @HttpCode(HttpStatus.OK)
  recoveryPassword(@Body() data: RecoveryPasswordDto): Promise<ApiResponse<RecoveryPasswordResponse>> {
    return this.authService.recoveryPassword(data);
  }
  // @Public()
  // @Patch('*/password/*')
  // @HttpCode(HttpStatus.OK)
  // changePassword(
  //   @GetCurrentUserId() id: string,
  //   @GetCurrentUser() data: ChangePasswordDto,
  // ): Promise<ApiResponse<UpdateResponse>> {
  //   return this.authService.changePassword(id, data);
  // }

  @Public()
  @UseGuards(RtGuard)
  @Get('user')
  @HttpCode(HttpStatus.FOUND)
  getUserInfo(@Cookies() token: string): Promise<ApiResponse<UserDataResponse>> {
    return this.authService.getUserInfo(token);
  }

  @Public()
  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshTokens(@Cookies('jwt-refresh') rt: string, @Res({ passthrough: true }) response: Response): Promise<Tokens> {
    return this.authService.refreshTokens(rt, response);
  }
}
