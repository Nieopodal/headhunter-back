import { Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { GetCurrentUserId, Role } from '../common/decorators';
import { UserRoleGuard } from '../common/guards';
import { ApiResponse, SimpleStudentData, StudentCv, StudentToInterview } from '@Types';
import { StudentService } from '../student/student.service';
import { StudentHrService } from '../student/student-hr.service';

@Controller('hr')
export class HrController {
  constructor(private readonly studentHrService: StudentHrService, private readonly studentService: StudentService) {
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
