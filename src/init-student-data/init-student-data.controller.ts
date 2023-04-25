import { Controller, Get, Header, Headers, Post, Res, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { InitStudentDataService } from './init-student-data.service';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { Readable } from 'stream';
import { parse } from 'csv-parse';
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
    return InitStudentData.find();
  }

  @Get('/sampleFile')
  @Header("Content-Type", "text/csv")
  @Header("Content-Disposition", `attachment; filename="sammpleUploadFile.csv"`)
  getSamepleFile(): String {
    return `email;courseCompletion;courseEngagment;projectDegree;teamProjectDegree;bonusProjectUrls
    bubelarek@gmail.com;1;2;3;4;www.1.pl|www.2.pl
    bubelarek2@gmail.com;1;2;3;4;www.1.pl|www.2.pl`
  }



  @Post('/load')
  @UseInterceptors(AnyFilesInterceptor())
  async uploadFile(@UploadedFiles() files: Array<Express.Multer.File>) {

    const records = [];

    // parser setting
    const parser = parse({
      delimiter: ';',
      trim: true,
      columns: true,
      cast: true

    });
    // Use the readable stream api to consume records
    parser.on('readable', async function () {
      let record: InitStudentDataDto;
      while ((record = parser.read()) !== null) {
        
        const initStudentData = new InitStudentData();
        initStudentData.email = record.email;
        initStudentData.bonusProjectUrls = record.bonusProjectUrls;
        initStudentData.courseCompletion = Number(record.courseCompletion);
        initStudentData.courseEngagment = Number(record.courseEngagment);
        initStudentData.projectDegree = Number(record.projectDegree);
        try {
          await initStudentData.save();
        } catch{
          e => console.log(e)
        }

        records.push(record);
      }
    });

    parser.on('error', function (err) {
      console.error(err.message);
    });


    const stream = Readable.from(files[0].buffer);

    // wait processing csv
    await new Promise(fulfill => stream.pipe(parser).on("close", fulfill));

    return records;

  }

 
}


