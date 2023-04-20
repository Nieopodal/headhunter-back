import { Injectable } from '@nestjs/common';
import { Admin } from './entity/admin.entity';

@Injectable()
export class AdminService {
  async getOneUser(id): Promise<Admin> {
    return await Admin.findOneByOrFail({
      id: id,
    });
  }
}
