import { IsNotEmpty, IsString } from 'class-validator';

export class ConfirmHrDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  token: string;
}
