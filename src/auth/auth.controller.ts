import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { LoginUserDto } from './dto';
import { AuthService } from './auth.service';
import { Tokens } from '@Types';
import { GetCurrentUser, GetCurrentUserId, Public } from "../common/decorators";

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() login: LoginUserDto): Promise<Tokens> {
    return this.authService.login(login);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshTokens(@GetCurrentUserId() id: string, @GetCurrentUser('refreshToken') refreshToken: string): Promise<Tokens> {
    return this.authService.refreshTokens(id, refreshToken);
  }
}
