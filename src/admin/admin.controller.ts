import { Body, Controller, HttpCode, HttpStatus, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { UploadStudentDataService } from '../student/upload-student-data.service';
import { ApiResponse, CreateResponse } from '@Types';
import { HrDto } from '../hr/dto';
import { HrService } from '../hr/hr.service';

@Controller('admin')
export class AdminController {
  constructor(private uploadStudentDataService: UploadStudentDataService, private hrService: HrService) {}

  @Post('upload/file')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<ApiResponse<object>> {
    return this.uploadStudentDataService.uploadFile(file);
  }

  @Post('hr/create')
  @HttpCode(HttpStatus.OK)
  createHr(@Body() formData: HrDto): Promise<ApiResponse<CreateResponse>> {
    return this.hrService.createHr(formData);
  }
}
