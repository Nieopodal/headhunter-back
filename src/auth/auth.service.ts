import { Injectable } from '@nestjs/common';
import { LoginUserDto } from './dto';
import { AdminService } from '../admin/admin.service';
// import { HrService } from '../hr/hr.service';
import { StudentService } from '../student/student.service';

@Injectable()
export class AuthService {
  constructor(private adminService: AdminService, private studentService: StudentService) {}

  async login(login: LoginUserDto): Promise<any> {
    const admin = await this.adminService.getUserByEmail(login.email);

    const hr = await this.hrService.getUserByEmail(login.email);

    const student = await this.studentService.getUserByEmail(login.email);

    return admin ? admin : hr ? hr : student;
  }
}
