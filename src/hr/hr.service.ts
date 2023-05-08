import { Injectable } from '@nestjs/common';
import { Hr } from './entity/hr.entity';

@Injectable()
export class HrService {
  async getHrByEmail(email: string): Promise<Hr> {
    return await Hr.findOneBy({ email });
  }
  async getHrById(id: string): Promise<Hr> {
    return await Hr.findOneBy({ id });
  }
}
