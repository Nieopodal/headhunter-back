import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { LoginUserDto } from './dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() login: LoginUserDto): Promise<any> {
    return this.authService.login(login);
  }
}
