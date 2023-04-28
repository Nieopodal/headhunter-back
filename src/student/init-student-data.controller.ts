import { Controller, HttpCode, HttpStatus, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public } from '../common/decorators';
import { InitStudentDataService } from './init-student-data.service';
import { Express } from 'express';

@Controller('upload')
export class InitStudentDataController {
  constructor(private initStudentDataService: InitStudentDataService) {}

  @Public()
  @Post('file')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.initStudentDataService.uploadFile(file);
  }
}
