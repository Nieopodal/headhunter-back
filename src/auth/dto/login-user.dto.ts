import { IsEmail, IsEmpty, IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class LoginUserDto {
  email: string;
  password: string;
}
