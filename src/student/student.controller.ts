import { Controller, Get, HttpCode, HttpStatus, Patch, UseGuards } from '@nestjs/common';
import { GetUserData, GetUserId, Public, Role } from '../common/decorators';
import { StudentService } from './student.service';
import { RegisterStudentDto, UpdateStudentDto } from './dto';

import { MtGuard, UserRoleGuard } from '../common/guards';
import { ApiResponse, SimpleStudentData, StudentCv, UpdateResponse, UpdateStudentResponse, UserRole } from '../types';

@Controller('student')
export class StudentController {
  constructor(private studentService: StudentService) {}

  @UseGuards(UserRoleGuard)
  @Role(UserRole.STUDENT)
  @HttpCode(HttpStatus.OK)
  @Get('/avatar')
  async getAvatar(@GetUserId() id: string): Promise<ApiResponse<string>> {
    return await this.studentService.getAvatar(id);
  }

  @UseGuards(UserRoleGuard)
  @Role(UserRole.STUDENT)
  @HttpCode(HttpStatus.OK)
  @Get('/simple')
  async getSimpleStudentData(@GetUserId() id: string): Promise<ApiResponse<SimpleStudentData>> {
    return await this.studentService.simpleStudentData(id);
  }

  @UseGuards(UserRoleGuard)
  @Role(UserRole.STUDENT)
  @HttpCode(HttpStatus.OK)
  @Get('/cv')
  async getStudentCv(@GetUserId() id: string): Promise<ApiResponse<StudentCv>> {
    return await this.studentService.getStudentCv(id);
  }

  @UseGuards(UserRoleGuard)
  @Role(UserRole.STUDENT)
  @Patch('/update')
  @HttpCode(HttpStatus.ACCEPTED)
  updateStudent(
    @GetUserId() id: string,
    @GetUserData() updateData: UpdateStudentDto,
  ): Promise<ApiResponse<UpdateStudentResponse>> {
    return this.studentService.updateStudent(id, updateData);
  }

  @Public()
  @UseGuards(MtGuard)
  @Patch('/register')
  registerStudent(
    @GetUserId() id: string,
    @GetUserData() registerData: RegisterStudentDto,
  ): Promise<ApiResponse<UpdateResponse>> {
    return this.studentService.registerStudentData(id, registerData);
  }

  @UseGuards(UserRoleGuard)
  @Role(UserRole.STUDENT)
  @HttpCode(HttpStatus.OK)
  @Patch('/employed')
  deactivate(@GetUserId() id: string): Promise<ApiResponse<any>> {
    return this.studentService.deactivate(id);
  }
}
