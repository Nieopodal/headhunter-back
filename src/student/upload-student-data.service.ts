import { Injectable } from '@nestjs/common';
import { parse } from 'csv-parse';
import { Readable } from 'stream';
import { Student } from './entity/student.entity';
import { StudentService } from './student.service';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UploadStudentDataService {
  constructor(private authService: AuthService, private studentService: StudentService) {}

  async uploadFile(file) {
    const records = [];
    const students = await this.studentService.get();
    const parser = parse({
      delimiter: ';',
      trim: true,
      columns: true,
      cast: true,
    });
    parser.on('readable', async () => {
      let record;
      while ((record = parser.read()) !== null) {
        if (!students.some((std) => std.email == record.email)) {
          records.push(record);
          await Student.createQueryBuilder('student').insert().into(Student).values(record).execute();
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
    console.log(records);
    return await Promise.all(records);
  }
}
