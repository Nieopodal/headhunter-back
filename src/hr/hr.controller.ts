import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { GetUserData, GetUserId, Public, Role } from '../common/decorators';
import { StudentService } from '../student/student.service';
import { StudentHrMethodsService } from '../student/student-hr-methods.service';
import { MtGuard, UserRoleGuard } from '../common/guards';
import { HrService } from './hr.service';
import { FilterStudentDto } from '../student/dto';
import { UpdateHrDto } from './dto';
import {
  ApiResponse,
  AvailableStudentsPaginated,
  StudentCv,
  StudentFilter,
  StudentsToInterviewPaginated,
  UpdateResponse,
  UserRole,
} from '@Types';

@Controller('hr')
export class HrController {
  constructor(
    private readonly studentHrService: StudentHrMethodsService,
    private readonly studentService: StudentService,
    private readonly hrService: HrService,
  ) {}

  @UseGuards(UserRoleGuard)
  @Role(UserRole.HR)
  @Get('/remove-filter')
  async removeFilter(@GetUserId() hrId: string): Promise<ApiResponse<null>> {
    return this.studentHrService.removeFilter(hrId);
  }

  @UseGuards(UserRoleGuard)
  @Role(UserRole.HR)
  @Get('/show-available/:pageNumber?/:numberPerPage?/:name?')
  async showAvailableStudents(
    @GetUserId() hrId: string,
    @Param('name') name: string = '',
    @Param('pageNumber') pageNumber = 1,
    @Param('numberPerPage') numberPerPage = 10,
  ): Promise<ApiResponse<AvailableStudentsPaginated>> {
    return this.studentHrService.showAvailableStudents(name, pageNumber, numberPerPage, hrId);
  }

  @UseGuards(UserRoleGuard)
  @Role(UserRole.HR)
  @Get('/show-interview/:pageNumber?/:numberPerPage?/:name?')
  async showInterviewStudents(
    @GetUserId() hrId: string,
    @Param('name') name = '',
    @Param('pageNumber') pageNumber = 1,
    @Param('numberPerPage') numberPerPage = 10,
  ): Promise<ApiResponse<StudentsToInterviewPaginated>> {
    return this.studentHrService.showInterviewStudents(name, pageNumber, numberPerPage, hrId);
  }

  @UseGuards(UserRoleGuard)
  @Role(UserRole.HR)
  @Get('/interview/cv/:id')
  async showStudentCv(@Param('id') id: string): Promise<ApiResponse<StudentCv>> {
    return this.studentService.getStudentCv(id);
  }

  @UseGuards(UserRoleGuard)
  @Role(UserRole.HR)
  @Post('/set-filter')
  async setFilter(
    @GetUserId() hrId: string,
    @Body() data: FilterStudentDto,
  ): Promise<ApiResponse<StudentFilter>> {
    return this.studentHrService.setFilter(data, hrId);
  }

  @UseGuards(UserRoleGuard)
  @Role(UserRole.HR)
  @Patch('/interview/:id')
  async setToInterview(@Param('id') id: string, @GetUserId() hrId: string): Promise<ApiResponse<null>> {
    return this.studentHrService.setToInterview(id, hrId);
  }

  @UseGuards(UserRoleGuard)
  @Role(UserRole.HR)
  @Patch('/withdraw/:id')
  async setDisinterest(@Param('id') id: string, @GetUserId() hrId: string): Promise<ApiResponse<null>> {
    return this.studentHrService.setDisinterest(id, hrId);
  }

  @UseGuards(UserRoleGuard)
  @Role(UserRole.HR)
  @Patch('/employed/:id')
  async setEmployed(@Param('id') id: string, @GetUserId() hrId: string): Promise<ApiResponse<null>> {
    return this.studentHrService.setEmployed(id, hrId);
  }

  @Public()
  @UseGuards(MtGuard)
  @Patch('/update')
  setPasswordHr(@GetUserId() id: string, @GetUserData() data: UpdateHrDto): Promise<ApiResponse<UpdateResponse>> {
    return this.hrService.setPasswordHr(id, data);
  }
}
