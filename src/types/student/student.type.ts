import { ExpectedContractType, ExpectedTypeWork } from '../../student/entity/student.entity';

export type StudentPartialData = {
  id: string;

  email: string;

  contactNumber: string;

  firstName: string;

  lastName: string;

  githubUsername: string;

  portfolioUrls: string[];

  bonusProjectUrls: string[];

  bio: string;

  education: string;

  workExperience: string;

  courses: string;
};

export type SimpleStudentData = {
  courseCompletion: number;
  courseEngagement: number;
  projectDegree: number;
  teamProjectDegree: number;
  expectedTypeWork: ExpectedTypeWork;
  targetWorkCity: string;
  expectedContractType: ExpectedContractType;
  expectedSalary: string;
  canTakeApprenticeship: boolean;
  commercialExp: number;
};

export type StudentCv = StudentPartialData & SimpleStudentData;
