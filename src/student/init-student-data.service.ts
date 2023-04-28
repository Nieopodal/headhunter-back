import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { parse } from 'csv-parse';
import { Readable } from 'stream';
import { InitStudentData } from './entity/init-student-data.entity';

@Injectable()
export class InitStudentDataService {
  constructor(private configService: ConfigService) {}

  async uploadFile(file) {
    // await InitStudentData.query('DELETE FROM  init_student_data WHERE 1=1');

    const records = [];
    const parser = parse({
      delimiter: ';',
      trim: true,
      columns: true,
      cast: true,
    });
    parser.on('readable', function () {
      let record;
      while ((record = parser.read()) !== null) {
        const data = new InitStudentData();
        data.email = record.email;
        data.bonusProjectUrls = record.bonusProjectUrls;
        data.courseCompletion = Number(record.courseCompletion);
        data.courseEngagement = Number(record.courseEngagement);
        data.projectDegree = Number(record.projectDegree);
        data.teamProjectDegree = Number(record.teamProjectDegree);
        data.save();
        records.push(data);
      }
    });
    parser.on('error', function (err) {
      console.error(err.message);
    });

    const stream = Readable.from(file.buffer).pipe(parser);

    await new Promise((resolve, reject) => {
      stream.on('end', resolve);
      stream.on('error', reject);
    });
    return await Promise.all(records);
  }

  async getInitStudentById(id: string): Promise<InitStudentData> {
    return await InitStudentData.findOneBy({ id });
  }

  async getInitStudents(): Promise<InitStudentData[]> {
    return await InitStudentData.find();
  }
}
