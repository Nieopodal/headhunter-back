import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateAdminDto {
  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  newPassword: string;
}
