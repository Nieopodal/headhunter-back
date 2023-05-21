import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { ExpectedContractType, ExpectedTypeWork } from '../../types';

export class UpdateStudentDto {
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(255)
  email: string;

  @IsOptional()
  @IsPhoneNumber('PL')
  contactNumber?: string | null;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(70)
  lastName: string;

  @IsString()
  githubUsername: string;

  @IsOptional()
  @IsArray()
  portfolioUrls?: string[] | null;

  @IsNotEmpty()
  @IsArray()
  projectUrls: string[];

  @IsOptional()
  @IsString()
  @MaxLength(400)
  bio?: string;

  @IsNotEmpty()
  @IsEnum(ExpectedTypeWork)
  expectedTypeWork: ExpectedTypeWork;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  targetWorkCity?: string;

  @IsNotEmpty()
  @IsEnum(ExpectedContractType)
  expectedContractType: ExpectedContractType;

  @IsOptional()
  @IsNumberString()
  expectedSalary?: string | null;

  @IsNotEmpty()
  @IsBoolean()
  canTakeApprenticeship: boolean;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(999)
  monthsOfCommercialExp: number;

  @IsOptional()
  @IsString()
  education?: string | null;

  @IsOptional()
  @IsString()
  workExperience?: string | null;
}
