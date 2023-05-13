import { Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { StudentService } from './student.service';
import { GetCurrentUser, GetCurrentUserId, Public, Role } from '../common/decorators';
import { UpdateStudentDto } from './dto';
import {
  ApiResponse,
  ConfirmResponse,
  SimpleStudentData,
  StudentCv,
  UpdateStudentResponse,
  UserRole,
  VerifyUserResponse,
} from '@Types';
import { ConfirmStudentDto } from './dto/confirm-student.dto';
import { UserRoleGuard } from 'src/common/guards/user-role.guard';
import { RegisterStudentDto } from './dto/register-student.dto';

@Controller('student')
export class StudentController {
  constructor(private studentService: StudentService) {}

  @UseGuards(UserRoleGuard)
  @Role(UserRole.STUDENT)
  @Get('/avatar')
  async getAvatar(@GetCurrentUserId() id: string): Promise<ApiResponse<string>> {
    return await this.studentService.getAvatar(id);
  }

  @UseGuards(UserRoleGuard)
  @Role(UserRole.STUDENT)
  @Get('/simple/')
  async getSimpleStudentData(@GetCurrentUserId() id: string): Promise<ApiResponse<SimpleStudentData>> {
    return await this.studentService.simpleStudentData(id);
  }

  @UseGuards(UserRoleGuard)
  @Role(UserRole.STUDENT)
  @Get('/cv')
  async getStudentCv(@GetCurrentUserId() id: string): Promise<ApiResponse<StudentCv>> {
    return await this.studentService.getStudentCv(id);
  }

  @UseGuards(UserRoleGuard)
  @Role(UserRole.STUDENT)
  @Patch('update')
  @HttpCode(HttpStatus.ACCEPTED)
  updateStudent(
    @GetCurrentUserId() id: string,
    @GetCurrentUser() updateData: UpdateStudentDto,
  ): Promise<ApiResponse<UpdateStudentResponse>> {
    return this.studentService.updateStudent(id, updateData);
  }

  @Public()
  @Get('verify/:id/:token')
  verifyUser(@Param('id') id: string, @Param('token') token: string): Promise<ApiResponse<VerifyUserResponse>> {
    return this.studentService.verifyUser(id, token);
  }

  @Public()
  @Patch('register/:id/:token')
  registerStudent(
    @Param('id') id: string,
    @Param('token') token: string,
    @GetCurrentUser() registerData: RegisterStudentDto,
  ) {
    return this.studentService.registerStudentData(id, token, registerData);
  }

  @Public()
  @Post('confirm/:id/:token')
  @HttpCode(HttpStatus.OK)
  confirmAccount(@Param() param: ConfirmStudentDto): Promise<ApiResponse<ConfirmResponse>> {
    return this.studentService.confirmStudentAccount(param);
  }

  @UseGuards(UserRoleGuard)
  @Role(UserRole.STUDENT)
  @Patch('/employed')
  deactivate(@GetCurrentUserId() id: string): Promise<ApiResponse<any>> {
    return this.studentService.deactivate(id);
  }
}
