import { Student } from '../entity/student.entity';
import { AvailableStudent, StudentToInterview } from '../../types';

export const availableFilter = (data: Student): AvailableStudent => {
  const {
    education,
    courses,
    role,
    createdAt,
    updatedAt,
    refreshToken,
    active,
    githubUsername,
    status,
    hr,
    bio,
    contactNumber,
    portfolioUrls,
    email,
    password,
    verificationToken,
    scrumProjectUrls,
    projectUrls,
    workExperience,
    reservationTime,
    activationUrl,
    ...rest
  } = data;
  return rest;
};

export const interviewFilter = (data: Student): StudentToInterview => {
  const {
    education,
    courses,
    role,
    createdAt,
    updatedAt,
    refreshToken,
    active,
    status,
    hr,
    bio,
    contactNumber,
    portfolioUrls,
    email,
    password,
    verificationToken,
    scrumProjectUrls,
    projectUrls,
    workExperience,
    activationUrl,
    ...rest
  } = data;
  return rest;
};
