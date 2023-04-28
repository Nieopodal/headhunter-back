import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { parse } from 'csv-parse';
import { Readable } from 'stream';
import { Student } from './entity/student.entity';

@Injectable()
export class InitStudentDataService {
  constructor(private configService: ConfigService) {}

  async uploadFile(file) {
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
        const data = new Student();
        data.email = record.email;
        data.courseCompletion = Number(record.courseCompletion);
        data.courseEngagement = Number(record.courseEngagement);
        data.projectDegree = Number(record.projectDegree);
        data.teamProjectDegree = Number(record.teamProjectDegree);
        data.bonusProjectUrls = record.bonusProjectUrls;
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
  async getStudentById(id: string): Promise<Student> {
    return await Student.findOneBy({ id });
  }
  async getStudents(): Promise<Student[]> {
    return await Student.find();
  }
}
