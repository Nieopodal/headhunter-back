import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AdminModule } from '../admin/admin.module';
import { HrModule } from '../hr/hr.module';
import { StudentModule } from '../student/student.module';
import { JwtModule } from '@nestjs/jwt';
import { AtStrategy, RtStrategy } from './strategies';
import { UploadStudentDataModule } from '../student/upload-student-data.module';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    forwardRef(() => AdminModule),
    forwardRef(() => StudentModule),
    forwardRef(() => MailModule),
    forwardRef(() => HrModule),
    forwardRef(() => UploadStudentDataModule),
    forwardRef(() => JwtModule.register({})),
  ],
  controllers: [AuthController],
  providers: [AuthService, AtStrategy, RtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
