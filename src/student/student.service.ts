import { Injectable } from '@nestjs/common';
import { Student } from './entity/student.entity';

@Injectable()
export class StudentService {
  async getUserByEmail(email: string): Promise<Student> {
    return await Student.findOneBy({ email });
  }
  async getUserById(id: string): Promise<Student> {
    return await Student.findOneBy({ id });
  }
}
