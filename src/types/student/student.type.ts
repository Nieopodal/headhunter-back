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

export type StudentToInterview = SimpleStudentData & {
  id: string;
  firstName: string;
  lastName: string;
  reservationTime: Date;
};


export type UpdateStudentResponse = {
  id: string;
};

export type StudentsToInterviewPaginated = {
  studentData: StudentToInterview[],
  totalPages: number,
}

export type AvailableStudentsPaginated = {
  studentData: SimpleStudentData[],
  totalPages: number
}


export type StudentCv = StudentPartialData & SimpleStudentData;

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

export enum StudentStatus {
  AVAILABLE = 'available',
  INTERVIEW = 'interview',
  EMPLOYED = 'employed',
}
