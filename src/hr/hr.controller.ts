import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, UseGuards } from '@nestjs/common';
import { GetCurrentUserId, Public, Role } from '../common/decorators';
import {
  ApiResponse,
  AvailableStudentsPaginated,
  StudentCv,
  StudentsToInterviewPaginated,
  UpdateResponse,
  UserRole,
} from '@Types';
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
  @Get('/available/:pageNumber?/:numberPerPage?')
  async showAvailableStudents(
    @Param('pageNumber') pageNumber = 1,
    @Param('numberPerPage') numberPerPage = 10,
  ): Promise<ApiResponse<AvailableStudentsPaginated>> {
    return this.studentService.getFreeStudents(pageNumber, numberPerPage);
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
  @Get('/interview/:pageNumber?/:numberPerPage?')
  async showStudentsToInterview(
    @GetCurrentUserId() hrId: string,
    @Param('pageNumber') pageNumber = 1,
    @Param('numberPerPage') numberPerPage = 10,
  ): Promise<ApiResponse<StudentsToInterviewPaginated>> {
    return this.studentHrService.showStudentsToInterview(hrId, pageNumber, numberPerPage);
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
