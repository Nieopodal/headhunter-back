import { Injectable } from '@nestjs/common';
import {
  ApiResponse,
  SimpleStudentData,
  UpdateStudentResponse,
  StudentCv,
  StudentStatus,
  AvailableStudentsPaginated,
} from '@Types';
import { UpdateResponse } from 'src/types/auth/response.type';

import { Student } from './entity/student.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class StudentService {
  constructor (
    private authService: AuthService
  ) {}
  async getAvatar(id: string): Promise<ApiResponse<string>> {
    const studentAvatar = await Student.findOneBy({ id });
    if (!studentAvatar) {
      return { isSuccess: false, error: 'Nie znaleziono użytkownika' };
    }
    return { isSuccess: true, payload: studentAvatar.githubUsername };
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
        'student.projectUrls',
        'student.expectedTypeWork',
        'student.expectedContractType',
        'student.targetWorkCity',
        'student.expectedSalary',
        'student.canTakeApprenticeship',
        'student.monthsOfCommercialExp',
        'student.education',
        'student.courses',
        'student.scrumProjectUrls',
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

  async deactivate(id: string): Promise<ApiResponse<UpdateResponse>> {
    const student: Student = await Student.findOneBy({
      id,
      active: true,
    });
    try {
      student.active = true;
      student.status = StudentStatus.EMPLOYED;
      student.hr = null;
      student.reservationTime = null;
      student.firstName = null;
      student.lastName = null;
      await Student.save(student);
      return { isSuccess: true, payload: { id } };
    } catch {
      return { isSuccess: false, error: 'Nie znaleziono studenta' };
    }
  }

  async getFreeStudents(pageNumber: number, numberPerPage: number): Promise<ApiResponse<AvailableStudentsPaginated>> {
    const count = await Student.createQueryBuilder('student')
      .where('student.hr IS NULL')
      .andWhere('student.active = :active', { active: true })
      .andWhere('student.status = :status', { status: StudentStatus.AVAILABLE })
      .getCount();

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
        'student.expectedContractType',
        'student.targetWorkCity',
        'student.expectedSalary',
        'student.canTakeApprenticeship',
        'student.monthsOfCommercialExp',
      ])
      .where('student.hr IS NULL')
      .andWhere('student.active = :active', { active: true })
      .andWhere('student.status = :status', { status: StudentStatus.AVAILABLE })
      .skip(numberPerPage * (pageNumber - 1))
      .take(numberPerPage)
      .getRawMany();

    const totalPages = Math.ceil(count / numberPerPage);

    if (!studentData) {
      return { isSuccess: false, error: 'Nie znaleziono studenta' };
    }
    return { isSuccess: true, payload: { studentData, totalPages } };
  }

  async getStudentByEmail(email: string): Promise<Student> {
    return await Student.findOneBy({ email });
  }

  async getStudentById(id: string): Promise<Student> {
    return await Student.findOneBy({ id });
  }

  async get(): Promise<Student[]> {
    return await Student.find();
  }

  async updateStudent(data, id): Promise<ApiResponse<UpdateResponse>> {
    try {
      await Student.createQueryBuilder('student').update(Student).set(data).where('id=:id', { id }).execute();
      return {
        isSuccess: true,
        payload: { id },
      };
    } catch (e) {
      return { isSuccess: false, error: 'Ups.... coś poszło nie tak' };
    }
  }

  async registerStudentData(id, registerData): Promise<ApiResponse<UpdateResponse>> {
    try {
      await Student.createQueryBuilder('student')
        .update(Student)
        .set(registerData)
        .where('student.id = :id', { id })
        .execute();
      await Student.createQueryBuilder('student')
        .update(Student)
        .set({ password: this.authService.hashData(registerData.password), active: true, verificationToken: null, activationUrl: null })
        .where('student.id = :id', { id })
        .execute();
      return { isSuccess: true, payload: id };
    } catch (e) {
      return { isSuccess: false, error: e.message };
    }
  }
}
