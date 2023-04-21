import { Injectable } from '@nestjs/common';
import { Admin } from './entity/admin.entity';

@Injectable()
export class AdminService {
  async getUserByEmail(email: string): Promise<Admin> {
    return await Admin.findOneBy({ email });
  }
}
