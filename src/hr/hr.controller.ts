import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, UseGuards } from '@nestjs/common';
import { GetCurrentUserId, Public, Role } from '../common/decorators';
import { ApiResponse, SimpleStudentData, StudentCv, StudentToInterview, UpdateResponse, UserRole } from '@Types';
import { StudentService } from '../student/student.service';
import { StudentHrMethodsService } from '../student/student-hr-methods.service';
import { UserRoleGuard } from '../common/guards';
import { HrService } from './hr.service';
import { UpdateStudentDto } from '../student/dto';

@Controller('hr')
export class HrController {
  constructor(
    private readonly studentHrService: StudentHrMethodsService,
    private readonly studentService: StudentService,
    private readonly hrService: HrService,
  ) {}

  @UseGuards(UserRoleGuard)
  @Role(UserRole.HR)
  @HttpCode(HttpStatus.OK)
  @Get('/available')
  async showAvailableStudents(): Promise<ApiResponse<SimpleStudentData[]>> {
    return this.studentService.getFreeStudents();
  }

  @UseGuards(UserRoleGuard)
  @Role(UserRole.HR)
  @HttpCode(HttpStatus.OK)
  @Get('/interview')
  async showStudentsToInterview(@GetCurrentUserId() hrId: string): Promise<ApiResponse<StudentToInterview[]>> {
    return this.studentHrService.showStudentsToInterview(hrId);
  }

  @UseGuards(UserRoleGuard)
  @Role(UserRole.HR)
  @HttpCode(HttpStatus.OK)
  @Get('/interview/cv/:id')
  async showStudentCv(@Param('id') id: string): Promise<ApiResponse<StudentCv>> {
    return this.studentService.getStudentCv(id);
  }

  @UseGuards(UserRoleGuard)
  @Role(UserRole.HR)
  @HttpCode(HttpStatus.OK)
  @Patch('/interview/:id')
  async setToInterview(@Param('id') id: string, @GetCurrentUserId() hrId: string): Promise<ApiResponse<null>> {
    return this.studentHrService.setToInterview(id, hrId);
  }

  @UseGuards(UserRoleGuard)
  @Role(UserRole.HR)
  @HttpCode(HttpStatus.OK)
  @Patch('/withdraw/:id')
  async setDisinterest(@Param('id') id: string, @GetCurrentUserId() hrId: string): Promise<ApiResponse<null>> {
    return this.studentHrService.setDisinterest(id, hrId);
  }

  @UseGuards(UserRoleGuard)
  @Role(UserRole.HR)
  @HttpCode(HttpStatus.OK)
  @Patch('/employed/:id')
  async setEmployed(@Param('id') id: string, @GetCurrentUserId() hrId: string): Promise<ApiResponse<null>> {
    return this.studentHrService.setEmployed(id, hrId);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Patch('update')
  setPasswordHr(@Body() data: UpdateStudentDto): Promise<ApiResponse<UpdateResponse>> {
    return this.hrService.setPasswordHr(data);
  }
}
