import { ArrayMinSize, IsArray, IsBoolean, IsEnum, IsNotEmpty, IsNumber, Max, Min } from 'class-validator';
import { ExpectedContractType, ExpectedTypeWork } from '@Types';

export class FilterStudentDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  monthsOfCommercialExp: number;

  @IsNotEmpty()
  @IsBoolean()
  canTakeApprenticeship: boolean;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  teamProjectDegree: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  projectDegree: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  courseEngagement: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  courseCompletion: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  minSalary: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(9999999.99)
  maxSalary: number;

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @IsEnum(ExpectedContractType, { each: true })
  expectedContractType: ExpectedContractType[];

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @IsEnum(ExpectedTypeWork, { each: true })
  expectedTypeWork: ExpectedTypeWork[];
}
