import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { Student } from './entity/student.entity';
import { StudentService } from './student.service';
import { Public } from '../common/decorators';
import { UpdateStudentDto } from './dto';
import { AuthService } from '../auth/auth.service';
import { ApiResponse } from '@Types';
import { ResponseDataToFront } from '../types/auth/response-data.type';
import { RtGuard, VtGuard } from '../common/guards';

@Controller('student')
export class StudentController {
  constructor(private studentService: StudentService, private authService: AuthService) {}

  @UseGuards(VtGuard)
  @Post('update')
  @HttpCode(HttpStatus.ACCEPTED)
  updateStudent(@Body() registerData: UpdateStudentDto): Promise<ApiResponse<ResponseDataToFront>> {
    return this.studentService.updateStudent(registerData);
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

  // @Get('/deactivate')
  // deactivate(): void {
  //   return null; //this.studentService.deactivate()
  // }

  @Public()
  @Post('confirm/:id/:token')
  @HttpCode(HttpStatus.FOUND)
  confirmAccount(@Param() param: any): Promise<ApiResponse<ResponseDataToFront>> {
    return this.studentService.confirmStudentAccount(param);
  }
}
