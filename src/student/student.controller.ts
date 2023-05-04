import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { Student } from './entity/student.entity';
import { StudentService } from './student.service';
import { Public } from '../common/decorators';
import { UpdateStudentDto } from './dto';
import { AuthService } from '../auth/auth.service';
import { ApiResponse } from '@Types';
import { ResponseDataToFront } from '../types/auth/response-data.type';
import { ConfirmStudentDto } from './dto/confirm-student.dto';

@Controller('student')
export class StudentController {
  constructor(private studentService: StudentService, private authService: AuthService) {}

  @Public()
  @Get('all')
  getAllStudents(): Promise<Student[]> {
    return this.studentService.get();
  }

  @Get('one')
  getOneStudent(): Student {
    return null; //this.studentService.getOne()
  }
  // @UseGuards(VtGuard)
  @Public()
  @Post('update')
  @HttpCode(HttpStatus.ACCEPTED)
  updateStudent(@Body() registerData: UpdateStudentDto): Promise<ApiResponse<ResponseDataToFront>> {
    return this.studentService.updateStudent(registerData);
  }

  @Public()
  @Post('confirm/:id/:token')
  @HttpCode(HttpStatus.OK)
  confirmAccount(@Param() param: ConfirmStudentDto): Promise<ApiResponse<ResponseDataToFront>> {
    return this.studentService.confirmStudentAccount(param);
  }
}
