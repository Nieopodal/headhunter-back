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

  // @Get('/students')
  // async showAvailableStudents() {
  //   return this.hrService.showAvailableStudents();
  // }
  //
  // @Get('/interview')
  // async showStudentsToInterview(
  //   @GetCurrentUserId() hrId: string,
  // ){
  //   return this.hrService.showStudentsToInterview(hrId)
  // }

  @UseGuards(UserRoleGuard)
  @Role('hr')
  @Patch('/interview/:id')
  async setToInterview(
    @Param('id') id: string,
    @GetCurrentUserId() hrId: string,
  ) {
    return this.hrService.setToInterview(id, hrId);
  }

  @UseGuards(UserRoleGuard)
  @Role('hr')
  @Patch('/withdraw/:id')
  async setDisinterest(
    @Param('id') id: string,
    @GetCurrentUserId() hrId: string,
  ) {
    return this.hrService.setDisinterest(id, hrId);
  }

  @UseGuards(UserRoleGuard)
  @Role('hr')
  @Patch('/employed/:id')
  async setEmployed(
    @Param('id') id: string,
    @GetCurrentUserId() hrId: string,
  ) {
    return this.hrService.setEmployed(id, hrId);
  }
}
