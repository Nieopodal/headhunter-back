import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { StudentService } from './student.service';
import { GetCurrentUserId, Public, Role } from '../common/decorators';
import { UpdateStudentDto } from './dto';
import { ApiResponse, SimpleStudentData, StudentCv, UpdateStudentResponse } from '@Types';
import { UserDataResponse } from '../types/auth/response-data.type';
import { ConfirmStudentDto } from './dto/confirm-student.dto';
import { UserRoleGuard } from 'src/common/guards/user-role.guard';

@Controller('student')
export class StudentController {
  constructor(private studentService: StudentService) {}

  @UseGuards(UserRoleGuard)
  @Role('student')
  @Get('/avatar')
  async getAvatar(@GetCurrentUserId() id: string): Promise<ApiResponse<string>> {
    return await this.studentService.getAvatar(id);
  }

  @UseGuards(UserRoleGuard)
  @Role('student')
  @Get('/simple/')
  async getSimpleStudentData(@GetCurrentUserId() id: string): Promise<ApiResponse<SimpleStudentData>> {
    return await this.studentService.simpleStudentData(id);
  }

  @UseGuards(UserRoleGuard)
  @Role('student')
  @Get('/cv')
  async getStudentCv(@GetCurrentUserId() id: string): Promise<ApiResponse<StudentCv>> {
    return await this.studentService.getStudentCv(id);
  }

  @UseGuards(UserRoleGuard)
  @Role('student')
  @Patch('update')
  @HttpCode(HttpStatus.ACCEPTED)
  updateStudent(@Body() registerData: UpdateStudentDto): Promise<ApiResponse<UpdateStudentResponse>> {
    return this.studentService.updateStudent(registerData);
  }

  @Public()
  @Post('confirm/:id/:token')
  @HttpCode(HttpStatus.OK)
  confirmAccount(@Param() param: ConfirmStudentDto): Promise<ApiResponse<UserDataResponse>> {
    return this.studentService.confirmStudentAccount(param);
  }

  @UseGuards(UserRoleGuard)
  @Role('student')
  @Patch('/employed')
  deactivate(@GetCurrentUserId() id: string): Promise<ApiResponse<any>> {
    return this.studentService.deactivate(id);
  }
}
