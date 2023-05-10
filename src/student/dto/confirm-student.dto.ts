import { IsNotEmpty, IsString } from 'class-validator';

export class ConfirmStudentDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  verificationToken: string;
}
