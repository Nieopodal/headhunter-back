import { Injectable } from '@nestjs/common';
import { ApiResponse, SimpleStudentData, StudentCv } from '@Types';

import { Active, Student } from './entity/student.entity';
import { UpdateStudentDto } from './dto';

export interface UpdateStudentResponse {
  id: string;
}

@Injectable()
export class StudentService {
  async getStudentCv(id: string): Promise<ApiResponse<StudentCv>> {
    const studentCv = await Student.createQueryBuilder('student')
      .select([
        'student.id',
        'student.firstName',
        'student.lastName',
        'student.bio',
        'student.githubUsername',
        'student.courseCompletion',
        'student.courseEngagement',
        'student.projectDegree',
        'student.teamProjectDegree',
        'student.portfolioUrls',
        'student.teamProjectUrls',
        'student.teamProjectPR',
        'student.projectUrls',
        'student.expectedTypeWork',
        'student.targetWorkCity',
        'student.expectedSalary',
        'student.canTakeApprenticeship',
        'student.monthsOfCommercialExp',
        'student.education',
        'student.workExperience',
      ])
      .where('student.id = :id', { id })
      .getRawOne();

    if (!studentCv) {
      return { isSuccess: false, error: 'Nie znaleziono studenta' };
    }

    return { isSuccess: true, payload: studentCv };
  }

  async simpleStudentData(id: string): Promise<ApiResponse<SimpleStudentData>> {
    const studentData = await Student.createQueryBuilder('student')
      .select([
        'student.id',
        'student.firstName',
        'student.lastName',
        'student.courseCompletion',
        'student.courseEngagement',
        'student.projectDegree',
        'student.teamProjectDegree',
        'student.expectedTypeWork',
        'student.targetWorkCity',
        'student.expectedSalary',
        'student.canTakeApprenticeship',
        'student.monthsOfCommercialExp',
      ])
      .where('student.id = :id', { id })
      .getRawOne();
    if (!studentData) {
      return { isSuccess: false, error: 'Nie znaleziono studenta' };
    }
    return { isSuccess: true, payload: studentData };
  }

  async deactivate(id: string): Promise<ApiResponse<UpdateStudentResponse>> {
    const student = await Student.findOneBy({ id });
    try {
      student.active = Active.INACTIVE;
      await Student.save(student);
      return { isSuccess: true, payload: { id } };
    } catch {
      return { isSuccess: false, error: 'Nie znaleziono studenta' };
    }
  }

  async update(id: string, updateStudentDto: UpdateStudentDto): Promise<ApiResponse<UpdateStudentResponse>> {
    const student = await Student.findOneBy({ id });

    try {
      await Student.createQueryBuilder('student')
        .update(Student)
        .set(updateStudentDto)
        .where('student.id = :id', { id: student.id })
        .execute();

      return { isSuccess: true, payload: { id } };
    } catch {
      return { isSuccess: false, error: 'Ups... coś poszło nie tak.' };
    }
  }

  //Metody dla hr

  async getFreeStudents(): Promise<ApiResponse<SimpleStudentData[]>> {
    const studentData = await Student.createQueryBuilder('student')
      .select([
        'student.id',
        'student.firstName',
        'student.lastName',
        'student.courseCompletion',
        'student.courseEngagement',
        'student.projectDegree',
        'student.teamProjectDegree',
        'student.expectedTypeWork',
        'student.targetWorkCity',
        'student.expectedSalary',
        'student.canTakeApprenticeship',
        'student.monthsOfCommercialExp',
      ])
      .where('student.hr = NULL')
      .getRawMany();
    if (!studentData) {
      return { isSuccess: false, error: 'Nie znaleziono studenta' };
    }
    return { isSuccess: true, payload: studentData };
  }
  //Metody do logowania
  async getUserByEmail(email: string): Promise<Student> {
    return await Student.findOneBy({ email });
  }

  async getUserById(id: string): Promise<Student> {
    return await Student.findOneBy({ id });
  }
}
