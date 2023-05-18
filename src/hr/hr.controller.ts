import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { GetUserData, GetUserId, Public, Role } from '../common/decorators';
import {
  ApiResponse,
  AvailableStudentsPaginated,
  StudentCv,
  StudentFilter,
  StudentsToInterviewPaginated,
  UpdateResponse,
  UserRole,
} from '@Types';
import { StudentService } from '../student/student.service';
import { StudentHrMethodsService } from '../student/student-hr-methods.service';
import { MtGuard, UserRoleGuard } from '../common/guards';
import { HrService } from './hr.service';
import { FilterStudentDto } from '../student/dto/filter-student.dto';
import { UpdateHrDto } from './dto/update-hr.dto';

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
  @Get('/remove-filter')
  async removeFilter(): Promise<ApiResponse<null>> {
    return this.studentHrService.removeFilter();
  }

  @UseGuards(UserRoleGuard)
  @Role(UserRole.HR)
  @HttpCode(HttpStatus.OK)
  @Get('/show-available/:pageNumber?/:numberPerPage?/:name?')
  async showAvailableStudents(
    @Param('name') name: string = '',
    @Param('pageNumber') pageNumber = 1,
    @Param('numberPerPage') numberPerPage = 10,
  ): Promise<ApiResponse<AvailableStudentsPaginated>> {
    return this.studentHrService.showAvailableStudents(name, pageNumber, numberPerPage);
  }

  @UseGuards(UserRoleGuard)
  @Role(UserRole.HR)
  @HttpCode(HttpStatus.OK)
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
  @HttpCode(HttpStatus.OK)
  @Get('/interview/cv/:id')
  async showStudentCv(@Param('id') id: string): Promise<ApiResponse<StudentCv>> {
    return this.studentService.getStudentCv(id);
  }

  @UseGuards(UserRoleGuard)
  @Role(UserRole.HR)
  @Post('/set-filter')
  async setFilter(@Body() data: FilterStudentDto): Promise<ApiResponse<StudentFilter>> {
    return this.studentHrService.setFilter(data);
  }

  @UseGuards(UserRoleGuard)
  @Role(UserRole.HR)
  @HttpCode(HttpStatus.OK)
  @Patch('/interview/:id')
  async setToInterview(@Param('id') id: string, @GetUserId() hrId: string): Promise<ApiResponse<null>> {
    return this.studentHrService.setToInterview(id, hrId);
  }

  @UseGuards(UserRoleGuard)
  @Role(UserRole.HR)
  @HttpCode(HttpStatus.OK)
  @Patch('/withdraw/:id')
  async setDisinterest(@Param('id') id: string, @GetUserId() hrId: string): Promise<ApiResponse<null>> {
    return this.studentHrService.setDisinterest(id, hrId);
  }

  @UseGuards(UserRoleGuard)
  @Role(UserRole.HR)
  @HttpCode(HttpStatus.OK)
  @Patch('/employed/:id')
  async setEmployed(@Param('id') id: string, @GetUserId() hrId: string): Promise<ApiResponse<null>> {
    return this.studentHrService.setEmployed(id, hrId);
  }

  @Public()
  @UseGuards(MtGuard)
  @HttpCode(HttpStatus.OK)
  @Patch('/update')
  setPasswordHr(@GetUserId() id: string, @GetUserData() data: UpdateHrDto): Promise<ApiResponse<UpdateResponse>> {
    return this.hrService.setPasswordHr(id, data);
  }
}
