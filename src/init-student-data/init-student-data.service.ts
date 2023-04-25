import { Injectable } from '@nestjs/common';
import { InitStudentData } from './entity/init-student-data.entity';
import { Readable } from 'stream';
import { parse } from 'csv-parse';
import { InitStudentDataDto } from './dto/init-student-data.dto';
import { resolve } from 'path';



@Injectable()
export class InitStudentDataService {

    async getAll(): Promise<InitStudentData[]> {
        return  InitStudentData.find()
    }

    getSampleUploadFile(): String {
        return `email;courseCompletion;courseEngagment;projectDegree;teamProjectDegree;bonusProjectUrls
    bubelarek@gmail.com;1;2;3;4;www.1.pl|www.2.pl
    bubelarek2@gmail.com;1;2;3;4;www.1.pl|www.2.pl`
    }

    async parse(file) : Promise<InitStudentData[]> {

        await InitStudentData.query('DELETE FROM  init_student_data WHERE 1=1')

        const records = [];

        // parser setting
        const parser = parse({
          delimiter: ';',
          trim: true,
          columns: true,
          cast: true
    
        });
        // Use the readable stream api to consume records
        parser.on('readable', function () {
          let record: InitStudentDataDto;
          while ((record = parser.read()) !== null) {
            
            const initStudentData = new InitStudentData();
            initStudentData.email = record.email;
            initStudentData.bonusProjectUrls = record.bonusProjectUrls;
            initStudentData.courseCompletion = Number(record.courseCompletion);
            initStudentData.courseEngagment = Number(record.courseEngagment);
            initStudentData.projectDegree = Number(record.projectDegree);
            initStudentData.teamProjectDegree = Number(record.teamProjectDegree);
            try {
              records.push(initStudentData.save());
              
            } catch{
              e => console.log(e)
            }
    
     
          }
        });
    
        parser.on('error', function (err) {
          console.error(err.message);
        });
    
    
        const stream = Readable.from(file.buffer).pipe(parser)
    
     
        // wait untill csv stream is completly processed
        await  new Promise((resolve, reject) => {
          stream.on('end', resolve)
          stream.on('error', reject)
        })

        //console.log(records)
        // ensure all saving to database has finsihed and send back entities 
        return await Promise.all(records) //Promise.all(records.map(e => e.save()))


    }

}