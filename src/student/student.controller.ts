import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { StudentService, UpdateStudentResponse } from './student.service';
import { UpdateStudentDto } from './dto';
import { ApiResponse, SimpleStudentData, StudentCv } from '@Types';

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get('/avatar/:id')
  async getAvatar(@Param('id') id: string): Promise<ApiResponse<string>> {
    return await this.studentService.getAvatar(id);
  }

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

  @Patch('/update/:id')
  async updateUserData(
    @Param('id') id: string,
    @Body() updateStudentDto: UpdateStudentDto,
  ): Promise<ApiResponse<UpdateStudentResponse>> {
    return await this.studentService.update(id, updateStudentDto);
  }

  @Patch('/employed/:id')
  deactivate(@Param('id') id: string): Promise<ApiResponse<any>> {
    return this.studentService.deactivate(id);
  }
}
