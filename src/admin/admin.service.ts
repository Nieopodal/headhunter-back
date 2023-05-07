import { Injectable } from '@nestjs/common';
import { Admin } from './entity/admin.entity';

@Injectable()
export class AdminService {
  async getAdminByEmail(email: string): Promise<Admin> {
    return await Admin.findOneBy({ email });
  }

  async getUserById(id: string): Promise<Admin> {
    return await Admin.findOneBy({ id });
  }
}
