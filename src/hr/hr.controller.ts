import { Controller, Param, Patch, UseGuards } from '@nestjs/common';
import { HrService } from './hr.service';
import { GetCurrentUserId, Role } from '../common/decorators';
import { UserRoleGuard } from '../common/guards';

@Controller('hr')
export class HrController {

  constructor(
    private hrService: HrService,
  ) {
  }

  @UseGuards(UserRoleGuard)
  @Role('hr')
  @Patch('/interview/:id')
  async setToInterview(
    @Param('id') id: string,
    @GetCurrentUserId() hrId: string,
  ) {
    return this.hrService.setToInterview(id, hrId);
  }

}
