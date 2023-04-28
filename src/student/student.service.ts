import { Injectable } from '@nestjs/common';
import { Student } from './entity/student.entity';

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
}
