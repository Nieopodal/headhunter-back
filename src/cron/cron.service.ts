import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Student } from '../student/entity/student.entity';
import { StudentStatus } from '../types';

@Injectable()
export class CronService {
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async removeUnwantedStudents(): Promise<void> {
    try {
      const students = await Student.find({ where: { status: StudentStatus.INTERVIEW } });

      if (students.length > 0) {
        students.map(async (student) => {
          if (+student.reservationTime < +new Date()) {
            student.status = StudentStatus.AVAILABLE;
            student.hr = null;
            student.reservationTime = null;
            await student.save();
          }
        });
      }
    } catch {
      throw new Error('Wystąpił nieznany błąd!');
    }
  }
}
