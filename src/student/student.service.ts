import { Injectable } from '@nestjs/common';
import { Student } from './entity/student.entity';
import { InitStudentDataService } from './init-student-data.service';

@Injectable()
export class StudentService {
  constructor(private uploadFileService: InitStudentDataService) {}

  async getUserByEmail(email: string): Promise<Student> {
    return await Student.findOneBy({ email });
  }

  async getUserById(id: string): Promise<Student> {
    return await Student.findOneBy({ id });
  }

  async get(): Promise<Student[]> {
    return await Student.find();
  }
}
