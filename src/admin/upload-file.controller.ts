import { Controller, HttpCode, HttpStatus, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public } from '../common/decorators';
import { UploadFileService } from './upload-file.service';
import { Express } from 'express';

@Controller('upload')
export class UploadFileController {
  constructor(private uploadFileService: UploadFileService) {}

  @Public()
  @Post('file')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.uploadFileService.uploadFile(file);
  }
}
