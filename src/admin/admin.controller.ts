import { Controller, HttpCode, HttpStatus, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { Public } from '../common/decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { UploadStudentDataService } from '../student/upload-student-data.service';
import { ApiResponse } from '@Types';

@Controller('admin')
export class AdminController {
  constructor(private uploadStudentDataService: UploadStudentDataService) {}

  @Public()
  @Post('upload/file')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<ApiResponse<object>> {
    return this.uploadStudentDataService.uploadFile(file);
  }
}
