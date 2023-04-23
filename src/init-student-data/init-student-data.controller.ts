import { Controller, Get, Header, Headers, Post, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { InitStudentDataService } from './init-student-data.service';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express'
import { CsvParser  } from 'nest-csv-parser'
import { InitStudentData } from './entities/init-student-data.entity';

@Controller('init-student-data')
export class InitStudentDataController {
  constructor(
    private readonly initStudentDataService: InitStudentDataService,
    private readonly csvParser: CsvParser
    ) {
  }

  @Post('/load')
  @UseInterceptors(AnyFilesInterceptor())
  async uploadFile(@UploadedFiles() files: Array<Express.Multer.File>) {
    console.log(//await this.csvParser.parse(
      files//[0]//.buffer//, InitStudentData)
      );
    return 1;
  }

  @Post('/invite')
  sendMail(): Number {
    return 1
  }

  @Get('/sampleFile')
  @Header("Content-Type", "text/csv")
  @Header("Content-Disposition", `attachment; filename="sammpleUploadFile.csv"`)
  getSamepleFile(): String {
    return  `email;courseCompletion;courseEngagment;projectDegree;teamProjectDegree;bonusProjectUrls
    bubelarek@gmail.com;1;2;3;4;www.1.pl|www.2.pl
    bubelarek2@gmail.com;1;2;3;4;www.1.pl|www.2.pl`
  }
}


