import { IsArray, IsEmail, IsNotEmpty, IsNumber, Length, Max, Min } from 'class-validator';

export class UploadStudentsDto {
  @IsEmail()
  @IsNotEmpty()
  @Length(3, 255)
  email: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(5)
  courseCompletion: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(5)
  courseEngagement: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(5)
  projectDegree: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(5)
  teamProjectDegree: number;

  @IsArray()
  @IsNotEmpty()
  scrumProjectUrls: string[];
}
