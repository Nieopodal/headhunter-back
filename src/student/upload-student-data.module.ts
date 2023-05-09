import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { UploadStudentDataService } from './upload-student-data.service';
import { MulterModule } from '@nestjs/platform-express';
import { StudentModule } from './student.module';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    forwardRef(() => MailModule),
    forwardRef(() => MulterModule),
    forwardRef(() => StudentModule),
  ],
  providers: [UploadStudentDataService],
  exports: [UploadStudentDataService],
})
export class UploadStudentDataModule {}
