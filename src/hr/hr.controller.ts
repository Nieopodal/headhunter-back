import { Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { GetCurrentUserId, Public, Role } from '../common/decorators';
import { ApiResponse, ConfirmResponse, SimpleStudentData, StudentCv, StudentToInterview } from '@Types';
import { StudentService } from '../student/student.service';
import { StudentHrMethodsService } from '../student/student-hr-methods.service';
import { UserRoleGuard } from '../common/guards';
import { ConfirmHrDto } from './dto/confirm-hr.dto';
import { HrService } from './hr.service';
import { Hr } from './entity/hr.entity';

@Controller('hr')
export class HrController {
  constructor(
    private readonly studentHrService: StudentHrMethodsService,
    private readonly studentService: StudentService,
    private readonly hrService: HrService,
  ) {}

  @Public()
  @Get('all')
  getAllHr(): Promise<Hr[]> {
    return this.hrService.get();
  }

  @Public()
  @Post('confirm/:id/:token')
  @HttpCode(HttpStatus.OK)
  confirmAccount(@Param() param: ConfirmHrDto): Promise<ApiResponse<ConfirmResponse>> {
    return this.hrService.confirmHrAccount(param);
  }

  @UseGuards(UserRoleGuard)
  @Role('hr')
  @Get('/available')
  async showAvailableStudents(): Promise<ApiResponse<SimpleStudentData[]>> {
    return this.studentService.getFreeStudents();
  }

  @UseGuards(UserRoleGuard)
  @Role('hr')
  @Get('/interview')
  async showStudentsToInterview(@GetCurrentUserId() hrId: string): Promise<ApiResponse<StudentToInterview[]>> {
    return this.studentHrService.showStudentsToInterview(hrId);
  }

  @UseGuards(UserRoleGuard)
  @Role('hr')
  @Get('/interview/cv/:id')
  async showStudentCv(@Param('id') id: string): Promise<ApiResponse<StudentCv>> {
    return this.studentService.getStudentCv(id);
  }

  @UseGuards(UserRoleGuard)
  @Role('hr')
  @Patch('/interview/:id')
  async setToInterview(@Param('id') id: string, @GetCurrentUserId() hrId: string): Promise<ApiResponse<null>> {
    return this.studentHrService.setToInterview(id, hrId);
  }

  @UseGuards(UserRoleGuard)
  @Role('hr')
  @Patch('/withdraw/:id')
  async setDisinterest(@Param('id') id: string, @GetCurrentUserId() hrId: string): Promise<ApiResponse<null>> {
    return this.studentHrService.setDisinterest(id, hrId);
  }

  @UseGuards(UserRoleGuard)
  @Role('hr')
  @Patch('/employed/:id')
  async setEmployed(@Param('id') id: string, @GetCurrentUserId() hrId: string): Promise<ApiResponse<null>> {
    return this.studentHrService.setEmployed(id, hrId);
  }
}
