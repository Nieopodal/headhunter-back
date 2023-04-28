import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { Student } from './entity/student.entity';
import { StudentService } from './student.service';
import { Public } from '../common/decorators';
import { InitStudentDataService } from './init-student-data.service';
// import { InitStudentData } from './entity/init-student-data.entity';
import { UpdateStudentDto } from './dto';
import { AuthService } from '../auth/auth.service';
import { ApiResponse } from '@Types';
import { ResponseDataToFront } from '../types/auth/response-data.type';
import { RtGuard, VtGuard } from '../common/guards';

@Controller('student')
export class StudentController {
  constructor(
    private studentService: StudentService,
    private initStudentDataService: InitStudentDataService,
    private authService: AuthService,
  ) {}

  @UseGuards(VtGuard)
  @Post('update')
  @HttpCode(HttpStatus.ACCEPTED)
  updateStudent(@Body() registerData: UpdateStudentDto): Promise<ApiResponse<ResponseDataToFront>> {
    return this.authService.updateStudent(registerData);
  }

  // @Public()
  // @Get('confirm')
  // getInitStudents(): Promise<InitStudentData[]> {
  //   return this.initStudentDataService.getInitStudents();
  // }

  @Public()
  @Get('all')
  getAllStudents(): Promise<Student[]> {
    return this.studentService.get();
  }

  @Get('/one')
  getOneStudent(): Student {
    return null; //this.studentService.getOne()
  }

  @Patch('/update')
  updateUserData(): Student {
    return null; //this.studentService.update()
  }

  @Get('/deactivate')
  deactivate(): void {
    return null; //this.studentService.deactivate()
  }

  // @Public()
  // @Get('confirm/:id')
  // @HttpCode(HttpStatus.FOUND)
  // getInitStudentData(@Param() param: any): Promise<InitStudentData> {
  //   return this.initStudentDataService.getInitStudentById(param.id);
  // }
}
