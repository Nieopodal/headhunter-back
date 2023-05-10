import { forwardRef, Module } from '@nestjs/common';
import { HrController } from './hr.controller';
import { HrService } from './hr.service';
import { AuthModule } from '../auth/auth.module';
import { StudentModule } from '../student/student.module';
import { StudentHrMethodsService } from '../student/student-hr-methods.service';
import { MailModule } from '../mail/mail.module';
import { AdminModule } from '../admin/admin.module';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    forwardRef(() => StudentModule),
    forwardRef(() => MailModule),
    forwardRef(() => AdminModule),
  ],
  controllers: [HrController],
  providers: [HrService, StudentHrMethodsService],
  exports: [HrService],
})
export class HrModule {}
