import { Admin } from '../../admin/entity/admin.entity';
import { Student } from '../../student/entity/student.entity';
import { Hr } from '../../hr/entity/hr.entity';

export type BasicDataResponse = {
  id: string;
  email: string;
  role: string;
  access_token?: string;
};

export type AdminDataResponse = {
  name: string;
} & BasicDataResponse;

export type StudentDataResponse = {
  githubUsername: string;
  firstName: string;
  lastName: string;
} & BasicDataResponse;

export type HrDataResponse = {
  fullName: string;
} & BasicDataResponse;

export type UserDataResponse = AdminDataResponse | StudentDataResponse | HrDataResponse;

export type CheckUserResponse = Admin | Student | Hr | null;

export type CreateResponse = {
  id: string;
};

export type ConfirmResponse = {
  id: string;
};

export type UpdateResponse = {
  id: string;
};

export type RecoveryPasswordResponse = {
  sentToEmail: string;
};
