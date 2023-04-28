import { forwardRef, Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { AuthModule } from '../auth/auth.module';
import { InitStudentDataModule } from './init-student-data.module';

@Module({
  imports: [forwardRef(() => AuthModule), forwardRef(() => InitStudentDataModule)],
  controllers: [StudentController],
  providers: [StudentService],
  exports: [StudentService],
})
export class StudentModule {}
