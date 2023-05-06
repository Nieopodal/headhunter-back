import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { StudentService, UpdateStudentResponse } from './student.service';
import { UpdateStudentDto } from './dto';
import { ApiResponse, SimpleStudentData, StudentCv } from '@Types';
import { GetCurrentUserId } from '../common/decorators';

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get('/avatar')
  async getAvatar(@GetCurrentUserId() id: string): Promise<ApiResponse<string>> {
    return await this.studentService.getAvatar(id);
  }

  @Get('/simple')
  async getSimpleStudentData(@GetCurrentUserId() id: string): Promise<ApiResponse<SimpleStudentData>> {
    return await this.studentService.simpleStudentData(id);
  }

  @Get('/cv')
  async getStudentCv(@GetCurrentUserId() id: string): Promise<ApiResponse<StudentCv>> {
    return await this.studentService.getStudentCv(id);
  }

  @Get('/available')
  async getFreeStudents(): Promise<ApiResponse<SimpleStudentData[]>> {
    return await this.studentService.getFreeStudents();
  }

  @Patch('/update')
  async updateUserData(
    @GetCurrentUserId() id: string,
    @Body() updateStudentDto: UpdateStudentDto,
  ): Promise<ApiResponse<UpdateStudentResponse>> {
    return await this.studentService.update(id, updateStudentDto);
  }

  @Patch('/employed')
  deactivate(@GetCurrentUserId() id: string): Promise<ApiResponse<any>> {
    return this.studentService.deactivate(id);
  }
}
