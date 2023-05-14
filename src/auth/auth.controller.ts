import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { ChangePasswordDto, LoginUserDto } from './dto';
import { AuthService } from './auth.service';
import { ApiResponse, ConfirmResponse, RecoveryPasswordResponse, Tokens, UpdateResponse } from '@Types';
import { GetCurrentUserId, Public } from '../common/decorators';
import { BasicDataResponse } from '@Types';
import { RtGuard } from '../common/guards';
import { Cookies } from '../common/decorators/cookie.decorator';
import { RecoveryPasswordDto } from './dto/recovery-password.dto';
import { ConfirmDto } from './dto/confirm.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginData: LoginUserDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<ApiResponse<BasicDataResponse>> {
    return await this.authService.login(loginData, response);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@GetCurrentUserId() id: string): Promise<any> {
    return this.authService.logout(id);
  }

  @Public()
  @Post('*/confirm/:id/:token')
  @HttpCode(HttpStatus.OK)
  confirmUser(@Param() param: ConfirmDto): Promise<ApiResponse<ConfirmResponse>> {
    return this.authService.confirmUser(param);
  }

  @Public()
  @Post('password/recovery')
  @HttpCode(HttpStatus.OK)
  recoveryPassword(@Body() data: RecoveryPasswordDto): Promise<ApiResponse<RecoveryPasswordResponse>> {
    return this.authService.recoveryPassword(data);
  }

  @Public()
  @Patch('password/reset')
  @HttpCode(HttpStatus.OK)
  changePassword(@Body() data: ChangePasswordDto): Promise<ApiResponse<UpdateResponse>> {
    return this.authService.changePassword(data);
  }
  @Public()
  @UseGuards(RtGuard)
  @Get('user')
  @HttpCode(HttpStatus.FOUND)
  getUserInfo(@Cookies() token: string): Promise<ApiResponse<BasicDataResponse>> {
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
