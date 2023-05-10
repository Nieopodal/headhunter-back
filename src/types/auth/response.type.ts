export type UserDataResponse = {
  id: string;
  email: string;
  password?: string;
  role: string;
  githubUsername?: string;
  name?: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  access_token?: string;
};

export type CreateResponse = {
  id: string;
};

export type ConfirmResponse = {
  id: string;
};

export type UpdateResponse = {
  id: string;
};
