import { Module } from '@nestjs/common';
import { InitStudentDataService } from './init-student-data.service';
import { InitStudentDataController } from './init-student-data.controller';

@Module({
  controllers: [InitStudentDataController],
  providers: [InitStudentDataService]
})
export class InitStudentDataModule {}
