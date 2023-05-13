import { Injectable } from '@nestjs/common';
import {
  ApiResponse,
  SimpleStudentData,
  UpdateStudentResponse,
  StudentCv,
  StudentStatus,
  VerifyUserResponse,
} from '@Types';
import { ConfirmResponse, UpdateResponse } from 'src/types/auth/response.type';
import { Student } from './entity/student.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class StudentService {
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

  async deactivate(id: string): Promise<ApiResponse<UpdateStudentResponse>> {
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

  async getFreeStudents(): Promise<ApiResponse<SimpleStudentData[]>> {
    try {
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
          'student.expectedContractType',
          'student.targetWorkCity',
          'student.expectedSalary',
          'student.canTakeApprenticeship',
          'student.monthsOfCommercialExp',
        ])
        .where('student.hr IS NULL')
        .andWhere('student.active = :active', { active: true })
        .andWhere('student.status = :status', { status: StudentStatus.AVAILABLE })
        .getRawMany();
      if (!studentData) {
        return { isSuccess: false, error: 'Nie znaleziono studenta' };
      }
      return { isSuccess: true, payload: studentData };
    } catch (e) {
      return { isSuccess: false, error: e.message };
    }
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

  async confirmStudentAccount(param): Promise<ApiResponse<ConfirmResponse>> {
    const student = await this.getStudentById(param.id);
    if (student && param.token === student.verificationToken) {
      try {
        await Student.createQueryBuilder('student')
          .update(Student)
          .set({ active: true })
          .where('id=:id', { id: param.id })
          .execute();
        return {
          isSuccess: true,
          payload: { id: param.id },
        };
      } catch (e) {
        return { isSuccess: false, error: 'Ups... coś poszło nie tak.' };
      }
    }
    return { isSuccess: false, error: 'Ups... coś poszło nie tak.' };
  }
  async updateStudent(id, data): Promise<ApiResponse<UpdateResponse>> {
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

  async verifyUser(id, token): Promise<ApiResponse<VerifyUserResponse>> {
    try {
      const user = await Student.findOneBy({ id });
      const userFilteredData = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      };

      if (!user) {
        return { isSuccess: false, error: `Nie znaleziono użytkownika o id: ${id}.` };
      }

      if (user.verificationToken !== token) {
        return { isSuccess: false, error: `Token ${token} nie pasuje do użytkownika ${id}` };
      }

      return {
        isSuccess: true,
        payload: userFilteredData,
      };
    } catch (e) {
      return { isSuccess: false, error: e.message };
    }
  }

  async registerStudentData(id, token, registerData): Promise<ApiResponse<UpdateStudentResponse>> {
    try {
      const user = await Student.findOneBy({ id });
      if (!user) {
        return { isSuccess: false, error: `Nie znaleziono użytkownika o id: ${id}.` };
      }

      if (user.verificationToken !== token) {
        return { isSuccess: false, error: `Token ${token} nie pasuje do użytkownika o id: ${id}` };
      }
      if (registerData.password === '' || typeof registerData.password !== 'string') {
        return { isSuccess: false, error: 'Podane hasło jest nieprawidłowe' };
      }
      await Student.createQueryBuilder('student')
        .update(Student)
        .set(registerData)
        .where('student.id = :id', { id })
        .execute();
      await Student.createQueryBuilder('student')
        .update(Student)
        .set({ password: await bcrypt.hash(registerData.password, 10), active: true, verificationToken: null })
        .where('student.id = :id', { id })
        .execute();
    } catch (e) {
      return { isSuccess: false, error: e.message };
    }

    return { isSuccess: true, payload: id };
  }
}
