import { ExpectedContractType, ExpectedTypeWork } from '../../student/entity/student.entity';

export type Student = {
  id: string;

  email: string;

  password: string;

  contactNumber: string;

  firstName: string;

  lastName: string;

  githubUsername: string;

  portfolioUrls: string[];

  courseCompletion: number;

  courseEngagement: number;

  projectDegree: number;

  teamProjectDegree: number;

  bonusProjectUrls: string[];

  bio: string;

  expectedTypeWork: string;

  targetWorkCity: string;

  expectedContractType: string;

  expectedSalary: string;

  canTakeApprenticeship: boolean;

  monthsOfCommercialExp: number;

  education: string;

  workExperience: string;

  courses: string;

  active: boolean;

  role: string;

  refreshToken: string;
};

export type StudentToInterview = {
  id: string;
  fullName: string;
  avatar: string;
  reservationTime: Date;
  courseCompletion: number;
  courseEngagement: number;
  projectDegree: number;
  teamProjectDegree: number;
  expectedTypeWork: ExpectedTypeWork;
  targetWorkCity: string;
  expectedContractType: ExpectedContractType;
  expectedSalary: string;
  canTakeApprenticeship: boolean;
  monthsOfCommercialExp: number;
}