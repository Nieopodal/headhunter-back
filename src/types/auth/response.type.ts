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
  verificationToken?: string;
  activationUrl?: string;
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

export type RecoveryPasswordResponse = {
  email: string;
};
