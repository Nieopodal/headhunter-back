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
    await Student.createQueryBuilder('student')
      .update(Student)
      .set({ active: true, verificationToken: null })
      .where('id=:id', { id: param.id })
      .execute();
    const student = await Student.findOne({
      select: {
        id: true,
        email: true,
      },
      where: {
        id: param.id,
      },
    });
    return {
      isSuccess: true,
      payload: student,
    };
  }

  async updateStudent(data): Promise<ApiResponse<ResponseDataToFront>> {
    await Student.createQueryBuilder('student').update(Student).set(data).where('id=:id', { id: data.id }).execute();
    const student = await Student.findOne({
      select: {
        id: true,
        email: true,
      },
      where: {
        id: data.id,
      },
    });
    return {
      isSuccess: true,
      payload: student,
    };
  }
}
