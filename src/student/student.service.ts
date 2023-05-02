import { Injectable } from '@nestjs/common';
import { Student } from './entity/student.entity';
import { ApiResponse } from '@Types';
import { ResponseDataToFront } from '../types/auth/response-data.type';

@Injectable()
export class StudentService {
  async getStudentByEmail(email: string): Promise<Student> {
    return await Student.findOneBy({ email });
  }

  async getStudentById(id: string): Promise<Student> {
    return await Student.findOneBy({ id });
  }

  async get(): Promise<Student[]> {
    return await Student.find();
  }

  async confirmStudentAccount(param): Promise<ApiResponse<ResponseDataToFront>> {
    const student = await Student.findOneBy({ id: param.id });
    student.active = true;
    student.updatedAt = new Date(Date.now());
    await student.save();
    return {
      isSuccess: true,
      payload: {
        ...student,
      },
    };
  }

  async updateStudent(registerData): Promise<ApiResponse<ResponseDataToFront>> {
    const { projectDegree, teamProjectDegree, bonusProjectUrls, courseCompletion, courseEngagement, email } =
      await this.getStudentById(registerData.id);

    const {
      password,
      contactNumber,
      firstName,
      lastName,
      githubUsername,
      portfolioUrls,
      projectUrls,
      bio,
      expectedTypeWork,
      targetWorkCity,
      expectedContractType,
      expectedSalary,
      canTakeApprenticeship,
      monthsOfCommercialExp,
      education,
      workExperience,
      course,
    } = registerData;
    const newStudent = new Student();

    newStudent.email = email;
    newStudent.password = password;
    newStudent.contactNumber = contactNumber;
    newStudent.firstName = firstName;
    newStudent.lastName = lastName;
    newStudent.githubUsername = githubUsername;
    newStudent.portfolioUrls = [portfolioUrls];
    newStudent.projectUrls = [projectUrls];
    newStudent.courseCompletion = courseCompletion;
    newStudent.courseEngagement = courseEngagement;
    newStudent.projectDegree = projectDegree;
    newStudent.teamProjectDegree = teamProjectDegree;
    newStudent.bonusProjectUrls = bonusProjectUrls;
    newStudent.bio = bio;
    newStudent.expectedTypeWork = expectedTypeWork;
    newStudent.targetWorkCity = targetWorkCity;
    newStudent.expectedContractType = expectedContractType;
    newStudent.expectedSalary = expectedSalary;
    newStudent.canTakeApprenticeship = canTakeApprenticeship;
    newStudent.monthsOfCommercialExp = monthsOfCommercialExp;
    newStudent.education = education;
    newStudent.workExperience = workExperience;
    newStudent.courses = course;
    newStudent.active = true;
    await newStudent.save();

    return {
      isSuccess: true,
      payload: {
        ...newStudent,
      },
    };
  }
}
