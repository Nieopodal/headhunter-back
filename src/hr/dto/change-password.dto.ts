import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateHrDto {
  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  newPassword: string;
}
