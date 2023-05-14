import { Body, Controller, Get, HttpCode, HttpStatus, Patch, UseGuards } from '@nestjs/common';
import { StudentService } from './student.service';
import { GetCurrentUser, GetCurrentUserId, Public, Role } from '../common/decorators';
import { UpdateStudentDto } from './dto';
import { ApiResponse, SimpleStudentData, StudentCv, UpdateResponse, UserRole } from '@Types';
import { UserRoleGuard } from 'src/common/guards/user-role.guard';
import { RegisterStudentDto } from './dto/register-student.dto';

@Controller('student')
export class StudentController {
  constructor(private studentService: StudentService) {}

  @UseGuards(UserRoleGuard)
  @Role(UserRole.STUDENT)
  @HttpCode(HttpStatus.OK)
  @Get('/avatar')
  async getAvatar(@GetCurrentUserId() id: string): Promise<ApiResponse<string>> {
    return await this.studentService.getAvatar(id);
  }

  @UseGuards(UserRoleGuard)
  @Role(UserRole.STUDENT)
  @HttpCode(HttpStatus.OK)
  @Get('/simple/')
  async getSimpleStudentData(@GetCurrentUserId() id: string): Promise<ApiResponse<SimpleStudentData>> {
    return await this.studentService.simpleStudentData(id);
  }

  @UseGuards(UserRoleGuard)
  @Role(UserRole.STUDENT)
  @HttpCode(HttpStatus.OK)
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
  @Patch('register/:id/:token')
  registerStudent(@Param('id') id: string, @Param('token') token: string, @Body() registerData: RegisterStudentDto) {
    return this.studentService.registerStudentData(id, token, registerData);
    @Body() registerData: UpdateStudentDto,
  ): Promise<ApiResponse<UpdateResponse>> {
    return this.studentService.updateStudent(id, registerData);
  }

  @UseGuards(UserRoleGuard)
  @Role(UserRole.STUDENT)
  @HttpCode(HttpStatus.OK)
  @Patch('/employed')
  deactivate(@GetCurrentUserId() id: string): Promise<ApiResponse<any>> {
    return this.studentService.deactivate(id);
  }
}
