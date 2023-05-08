import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { Student } from './entity/student.entity';
import { StudentService } from './student.service';
import { Public } from '../common/decorators';
import { UpdateStudentDto } from './dto';
import { AuthService } from '../auth/auth.service';
import { ApiResponse, SimpleStudentData, StudentCv, UpdateStudentResponse } from '@Types';
import { UserDataResponse } from '../types/auth/response-data.type';
import { ConfirmStudentDto } from './dto/confirm-student.dto';
import { VtGuard } from '../common/guards';

@Controller('student')
export class StudentController {
  constructor(private studentService: StudentService, private authService: AuthService) {}

  @Get('/simple/:id')
  async getSimpleStudentData(@Param('id') id: string): Promise<ApiResponse<SimpleStudentData>> {
    return await this.studentService.simpleStudentData(id);
  }

  @Get('/cv/:id')
  async getStudentCv(@Param('id') id: string): Promise<ApiResponse<StudentCv>> {
    return await this.studentService.getStudentCv(id);
  }

  @Get('/available')
  async getFreeStudents(): Promise<ApiResponse<SimpleStudentData[]>> {
    return await this.studentService.getFreeStudents();
  }

  @Public()
  @Get('all')
  getAllStudents(): Promise<Student[]> {
    return this.studentService.get();
  }

  @Get('one')
  getOneStudent(): Student {
    return null; //this.studentService.getOne()
  }

  @Patch('update')
  @HttpCode(HttpStatus.ACCEPTED)
  updateStudent(@Body() registerData: UpdateStudentDto): Promise<ApiResponse<UpdateStudentResponse>> {
    return this.studentService.updateStudent(registerData);
  }
  @Public()
  // @UseGuards(VtGuard)
  @Post('confirm/:id/:token')
  @HttpCode(HttpStatus.OK)
  confirmAccount(@Param() param: ConfirmStudentDto): Promise<ApiResponse<UserDataResponse>> {
    return this.studentService.confirmStudentAccount(param);
  }

  @Patch('/employed/:id')
  deactivate(@Param('id') id: string): Promise<ApiResponse<any>> {
    return this.studentService.deactivate(id);
  }
}
