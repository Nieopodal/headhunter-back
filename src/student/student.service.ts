import { Injectable } from '@nestjs/common';
import { Student } from './entity/student.entity';
import { ApiResponse, ResponseUpdateStudent } from '@Types';
import { ResponseUserData } from '../types/auth/response-data.type';

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

  async generateUrl(email): Promise<string> {
    const { id, verificationToken } = await this.getStudentByEmail(email);
    return `http://localhost:3000/student/confirm/${id}/${verificationToken}`;
  }

  async confirmStudentAccount(param): Promise<ApiResponse<ResponseUserData>> {
    try {
      await Student.createQueryBuilder('student')
        .update(Student)
        .set({ active: true })
        .where('id=:id', { id: param.id })
        .execute();
      console.log(param);
      return {
        isSuccess: true,
        payload: param.id,
      };
    } catch (e) {
      return { isSuccess: false, error: 'Ups... coś poszło nie tak.' };
    }
  }

  async updateStudent(data): Promise<ApiResponse<ResponseUpdateStudent>> {
    try {
      await Student.createQueryBuilder('student').update(Student).set(data).where('id=:id', { id: data.id }).execute();
      return {
        isSuccess: true,
        payload: data.id,
      };
    } catch {
      return { isSuccess: false, error: 'Ups... coś poszło nie tak.' };
    }
  }
}
