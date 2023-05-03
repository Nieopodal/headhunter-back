import { ExpectedContractType, ExpectedTypeWork } from '@Types';

export class UpdateStudentDto {
  email: string;

  contactNumber?: string | null;

  firstName: string;

  lastName: string;

  githubUsername: string;

  portfolioUrls?: string[] | null;

  projectUrls: string[];

  bio: string;

  expectedTypeWork: ExpectedTypeWork;

  targetWorkCity?: string;

  expectedContractType: ExpectedContractType;

  expectedSalary?: string | null;

  canTakeApprenticeship: boolean;

  monthsOfCommercialExp: number;

  education?: string | null;

  workExperience?: string | null;

  courses?: string | null;
}
