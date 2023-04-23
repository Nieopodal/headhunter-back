import { Injectable } from '@nestjs/common';
import { Hr } from './entity/hr.entity';

@Injectable()
export class HrService {
  async getUserById(id: string): Promise<Hr> {
    return await Hr.findOneBy({ id });
  }
}
