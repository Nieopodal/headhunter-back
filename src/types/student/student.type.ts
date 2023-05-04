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

export enum ExpectedTypeWork {
  office = 'Na miejscu',
  move = 'Przeprowadzka',
  remote = 'Praca zdalna',
  hybrid = 'Praca hybrydowa',
  DM = 'Nie ma znaczenia',
}

export enum ExpectedContractType {
  B2B = 'Możliwe B2B',
  employ = 'Tylko umowa o pracę',
  contract = 'Umowa zlecenie / dzieło',
  none = 'Brak preferencji',
}
