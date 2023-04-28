import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { InitStudentDataController } from './init-student-data.controller';
import { InitStudentDataService } from './init-student-data.service';
import { MulterModule } from '@nestjs/platform-express';
import { StudentModule } from './student.module';

@Module({
  imports: [forwardRef(() => AuthModule), forwardRef(() => MulterModule), forwardRef(() => StudentModule)],
  controllers: [InitStudentDataController],
  providers: [InitStudentDataService],
  exports: [InitStudentDataService],
})
export class InitStudentDataModule {}
