import { Controller, HttpCode, HttpStatus, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public } from '../common/decorators';
import { UploadFileService } from './upload-file.service';
import { Express } from 'express';

@Public()
@Controller('uploads')
export class UploadFileController {
  constructor(private uploadFileService: UploadFileService) {}

  @Post('file')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.uploadFileService.uploadFile(file);
  }
}
