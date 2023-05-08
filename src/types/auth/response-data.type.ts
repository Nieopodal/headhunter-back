export type Admin = {
  id: string;
  name?: string;
  email: string;
  role: string;
  access_token: string;
};

export type Hr = {
  id: string;
  email: string;
  fullName?: string;
  role: string;
  access_token: string;
};

export type Student = {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
  access_token?: string;
};

export type UserDataResponse = {
  id: string;
  email: string;
  password?: string;
  role: string;
  name?: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  access_token?: string;
};
