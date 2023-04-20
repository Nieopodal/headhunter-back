import { Body, Controller, forwardRef, Get, HttpCode, HttpStatus, Inject, Post } from '@nestjs/common';
import { UsersService } from './users.service';

type checkUserDto = {
  id: string;
  role: string;
};

@Controller('users')
export class UsersController {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
  ) {}

  // @Public()
  @Post('getOneUser')
  @HttpCode(HttpStatus.OK)
  getOneUser(@Body() user: checkUserDto): Promise<any> {
    return this.usersService.checkUser(user);
  }
}
