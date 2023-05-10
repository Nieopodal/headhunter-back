import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseConfiguration } from './config/typeorm.config';
import { StudentModule } from './student/student.module';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { HrModule } from './hr/hr.module';
import { AtGuard } from './common/guards';
import { APP_GUARD } from '@nestjs/core';
import { MailModule } from './mail/mail.module';
import { UploadStudentDataModule } from './student/upload-student-data.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CronService } from './cron/cron.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfiguration,
    }),
    ScheduleModule.forRoot(),
    forwardRef(() => StudentModule),
    forwardRef(() => UploadStudentDataModule),
    forwardRef(() => AdminModule),
    forwardRef(() => HrModule),
    forwardRef(() => AuthModule),
    forwardRef(() => MailModule),
  ],
  controllers: [AppController],
  providers: [{ provide: APP_GUARD, useClass: AtGuard }, AppService, CronService],
})
export class AppModule {}
