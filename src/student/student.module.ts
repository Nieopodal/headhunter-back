import { forwardRef, Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { AuthModule } from '../auth/auth.module';
import { UploadStudentDataModule } from './upload-student-data.module';

@Module({
  imports: [forwardRef(() => AuthModule), forwardRef(() => UploadStudentDataModule)],
  controllers: [StudentController],
  providers: [StudentService],
  exports: [StudentService],
})
export class StudentModule {}
