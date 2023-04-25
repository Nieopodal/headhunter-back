import { Controller, Get, Header, Post, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { InitStudentDataService } from './init-student-data.service';
import { FileInterceptor } from '@nestjs/platform-express';

import { InitStudentDataDto } from './dto/init-student-data.dto';
import { InitStudentData } from './entity/init-student-data.entity';





@Controller('init-student-data')
export class InitStudentDataController {
  constructor(
    private readonly initStudentDataService: InitStudentDataService,
  ) {
  }

  @Get()
  async getAll() {
    return this.initStudentDataService.getAll()
  }

  @Get('/sampleFile')
  @Header("Content-Type", "text/csv")
  @Header("Content-Disposition", `attachment; filename="sammpleUploadFile.csv"`)
  getSamepleFile(): String {
    return  this.initStudentDataService.getSampleUploadFile()
  }

  @Post('/load')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    
  return await this.initStudentDataService.parse(file)
  }

 
}


