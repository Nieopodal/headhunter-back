import { forwardRef, Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule } from '@nestjs/config';
import { MailerConfiguration } from '../config/mailerconfig';
import { MailService } from './mail.service';
import { StudentModule } from '../student/student.module';
import { MailController } from './mail.controller';
import { HrModule } from '../hr/hr.module';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useClass: MailerConfiguration,
    }),
    forwardRef(() => StudentModule),
    forwardRef(() => HrModule),
  ],
  providers: [MailService],
  controllers: [MailController],
  exports: [MailService],
})
export class MailModule {}
