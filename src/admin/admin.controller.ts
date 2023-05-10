import { Body, Controller, HttpCode, HttpStatus, Patch, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { Public } from '../common/decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { UploadStudentDataService } from '../student/upload-student-data.service';
import { ApiResponse, CreateResponse } from '@Types';
import { HrDto } from '../hr/dto';
import { HrService } from '../hr/hr.service';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(
    private uploadStudentDataService: UploadStudentDataService,
    private hrService: HrService,
    private adminService: AdminService,
  ) {}

  @Public()
  @Post('upload/file')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<ApiResponse<object>> {
    return this.uploadStudentDataService.uploadFile(file);
  }

  @Public()
  @Post('hr/create')
  @HttpCode(HttpStatus.OK)
  createHr(@Body() formData: HrDto): Promise<ApiResponse<CreateResponse>> {
    return this.hrService.createHr(formData);
  }
}
