import { Injectable, UploadedFile } from '@nestjs/common';
import { Express } from 'express';
import fs from 'fs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadFileService {
  constructor(private configService: ConfigService) {}

  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    fs.writeFileSync(`${this.configService.get('UPLOAD_DIR')}`, file.originalname);
    return { message: 'file' };
  }
}
