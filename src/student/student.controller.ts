import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, UseGuards } from '@nestjs/common';
import { StudentService } from './student.service';
import { GetUserData, GetUserId, Public, Role } from '../common/decorators';
import { UpdateStudentDto } from './dto';
import { ApiResponse, SimpleStudentData, StudentCv, UpdateResponse, UpdateStudentResponse, UserRole } from '@Types';
import { UserRoleGuard } from 'src/common/guards/user-role.guard';
import { RegisterStudentDto } from './dto/register-student.dto';
import { MtGuard } from '../common/guards';

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
  @Get('/simple/')
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
  @Patch('update')
  @HttpCode(HttpStatus.ACCEPTED)
  updateStudent(
    @GetUserId() id: string,
    @GetUserData() updateData: UpdateStudentDto,
  ): Promise<ApiResponse<UpdateStudentResponse>> {
    return this.studentService.updateStudent(id, updateData);
  }

  @Public()
  @UseGuards(MtGuard)
  @Patch('register')
  registerStudent(
    @Param('id') id: string,
    @Param('token') token: string,
    @Body() registerData: RegisterStudentDto,
  ): Promise<ApiResponse<UpdateResponse>> {
    return this.studentService.updateStudent(id, registerData);
  }

  @UseGuards(UserRoleGuard)
  @Role(UserRole.STUDENT)
  @HttpCode(HttpStatus.OK)
  @Patch('/employed')
  deactivate(@GetUserId() id: string): Promise<ApiResponse<any>> {
    return this.studentService.deactivate(id);
  }
}
