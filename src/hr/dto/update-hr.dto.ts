import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateHrDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
