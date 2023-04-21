import { IsEmail, IsNotEmpty, IsNumber, IsString, Length, Max, Min } from 'class-validator';

export class HeadHunterDto {

  @IsEmail()
  @IsNotEmpty()
  @Length(3, 255)
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  fullName: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 150)
  company: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Max(999)
  maxReservedStudents: number;
}