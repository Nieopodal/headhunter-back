import { Controller, HttpCode, HttpStatus, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public } from '../common/decorators';
import { UploadFileService } from './upload-file.service';

@Public()
@Controller('uploads')
export class UploadFileController {
  constructor(private uploadFileService: UploadFileService) {}

  @Post('file')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file'))
  const;
  userData = await this.uploadFileService.uploadFile(file);
}
