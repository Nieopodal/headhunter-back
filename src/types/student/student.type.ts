export type StudentPartialData = {
  id: string;
  email: string;
  contactNumber: string;
  firstName: string;
  lastName: string;
  githubUsername: string;
  portfolioUrls: string[];
  scrumProjectUrls: string[];
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
  monthsOfCommercialExp: number;
};

export type AvailableStudent = SimpleStudentData & {
  id: string;
  firstName: string;
  lastName: string;
};

export type StudentToInterview = AvailableStudent & {
  reservationTime: Date;
};

export type StudentsToInterviewPaginated = {
  studentData: StudentToInterview[],
  totalPages: number,
}

export type AvailableStudentsPaginated = {
  studentData: AvailableStudent[],
  totalPages: number
}

export type StudentCv = StudentPartialData & SimpleStudentData;

export enum ExpectedTypeWork {
  OFFICE = 'Na miejscu',
  MOVE = 'Przeprowadzka',
  REMOTE = 'Praca zdalna',
  HYBRID = 'Praca hybrydowa',
  DM = 'Nie ma znaczenia',
}

export enum ExpectedContractType {
  B2B = 'Możliwe B2B',
  EMPLOY = 'Tylko umowa o pracę',
  CONTRACT = 'Umowa zlecenie / dzieło',
  NONE = 'Brak preferencji',
}

export enum StudentStatus {
  AVAILABLE = 'available',
  INTERVIEW = 'interview',
  EMPLOYED = 'employed',
}
