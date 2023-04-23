import { Module } from '@nestjs/common';
import { InitStudentDataService } from './init-student-data.service';
import { InitStudentDataController } from './init-student-data.controller';
import { CsvModule } from 'nest-csv-parser';

@Module({
  imports: [CsvModule],
  controllers: [InitStudentDataController],
  providers: [InitStudentDataService]
})
export class InitStudentDataModule {}
