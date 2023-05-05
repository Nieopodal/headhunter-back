import { Injectable } from '@nestjs/common';
import { ApiResponse, SimpleStudentData, StudentCv } from '@Types';

import { Student } from './entity/student.entity';
import { UpdateStudentDto } from './dto';

export interface UpdateStudentResponse {
  id: string;
}

@Injectable()
export class StudentService {
  async getAvatar(id: string): Promise<ApiResponse<string>> {
    const studentAvatar: Student = await Student.findOneBy({ id });
    if (!studentAvatar) {
      return { isSuccess: false, error: 'Nie znaleziono użytkownika' };
    }
    return { isSuccess: true, payload: studentAvatar.avatar };
  }

  async getStudentCv(id: string): Promise<ApiResponse<StudentCv>> {
    const studentCv: StudentCv = await Student.createQueryBuilder('student')
      .select([
        'student.id',
        'student.firstName',
        'student.lastName',
        'student.email',
        'student.contactNumber',
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
        'student.expectedContractType',
        'student.targetWorkCity',
        'student.expectedSalary',
        'student.canTakeApprenticeship',
        'student.monthsOfCommercialExp',
        'student.education',
        'student.courses',
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
    const studentData: SimpleStudentData = await Student.createQueryBuilder('student')
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
    const student: Student = await Student.findOneBy({
      id,
      active: true,
    });
    try {
      student.active = true;
      student.status = StudentStatus.EMPLOYED;
      student.interviewBy = null;
      student.reservationTime = null;
      student.firstName = null;
      student.lastName = null;
      student.avatar = null;
      await Student.save(student);
      return { isSuccess: true, payload: { id } };
    } catch {
      return { isSuccess: false, error: 'Nie znaleziono studenta' };
    }
  }

  async update(id: string, updateStudentDto: UpdateStudentDto): Promise<ApiResponse<UpdateStudentResponse>> {
    const student: Student = await Student.findOneBy({ id });

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
    const studentData: SimpleStudentData[] = await Student.createQueryBuilder('student')
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
      .where('student.interviewBy IS NULL')
      .andWhere('student.active = "active"')
      .andWhere('student.status = "available"')
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
