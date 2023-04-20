import { Injectable } from '@nestjs/common';
import { AdminService } from '../admin/admin.service';

@Injectable()
export class UsersService {
  constructor(private adminService: AdminService) {}

  async checkUser(user): Promise<void> {
    const { id, role } = user;
    switch (role) {
      case 'admin':
        await this.adminService.getOneUser(id);
        break;
      case 'student':
        // await this.studentService.getOneUser(id);
        break;
      case 'hr':
        // await this.hrService.getOneUser(id);
        break;
    }
  }
}
