import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { ChangePasswordDto, LoginUserDto } from './dto';
import { AuthService } from './auth.service';
import {
  ApiResponse,
  ConfirmResponse,
  RecoveryPasswordResponse,
  Tokens,
  UpdateResponse,
  UserDataResponse,
} from '@Types';
import { GetToken, GetUserData, GetUserId, Public } from '../common/decorators';
import { MtGuard, RtGuard } from '../common/guards';
import { RecoveryPasswordDto } from './dto/recovery-password.dto';
import { ConfirmDto } from './dto/confirm.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {
  }

  @Public()
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginData: LoginUserDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<ApiResponse<UserDataResponse>> {
    return await this.authService.login(loginData, response);
  }

  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  logout(@GetUserId() id: string, @Res({ passthrough: true }) res: Response): Promise<any> {
    return this.authService.logout(id, res);
  }

  @Public()
  @Post('*/confirm/:id/:token')
  @HttpCode(HttpStatus.OK)
  confirmFromEmail(@Param() param: ConfirmDto): Promise<ApiResponse<ConfirmResponse>> {
    return this.authService.confirmFromEmail(param);
  }

  @Public()
  @Post('/password/recovery')
  @HttpCode(HttpStatus.OK)
  recoveryPassword(@Body() data: RecoveryPasswordDto): Promise<ApiResponse<RecoveryPasswordResponse>> {
    return this.authService.recoveryPassword(data);
  }

  @Public()
  @UseGuards(MtGuard)
  @Patch('/password/reset')
  @HttpCode(HttpStatus.OK)
  changePassword(
    @GetUserId() id: string,
    @GetUserData() data: ChangePasswordDto,
  ): Promise<ApiResponse<UpdateResponse>> {
    return this.authService.changePassword(data, id);
  }

  @Public()
  @UseGuards(RtGuard)
  @Get('/user')
  @HttpCode(HttpStatus.FOUND)
  getUserInfo(@GetUserId() id: string): Promise<ApiResponse<UserDataResponse>> {
    return this.authService.getUserInfo(id);
  }

  @Public()
  @UseGuards(RtGuard)
  @Post('/refresh')
  @HttpCode(HttpStatus.OK)
  refreshTokens(
    @GetToken() rt: string,
    @GetUserId() id: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Tokens> {
    return this.authService.refreshTokens(id, rt, res);
  }
}
