import { Injectable } from '@nestjs/common';
import { parse } from 'csv-parse';
import { Readable } from 'stream';
import { Student } from './entity/student.entity';
import { StudentService } from './student.service';

@Injectable()
export class UploadStudentDataService {
  constructor(private studentService: StudentService) {}

  async uploadFile(file) {
    const records = [];
    const student = await this.studentService.get();
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
        if (!student.some((std) => std.email == record.email)) {
          records.push(data);
          data.save();
        }
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
}
