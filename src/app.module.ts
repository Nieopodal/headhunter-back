import { forwardRef, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { CacheModule } from '@nestjs/cache-manager';
import { ScheduleModule } from '@nestjs/schedule';
import { DatabaseConfiguration } from './config/typeorm.config';
import { StudentModule } from './student/student.module';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { HrModule } from './hr/hr.module';
import { AtGuard } from './common/guards';
import { MailModule } from './mail/mail.module';
import { UploadStudentDataModule } from './student/upload-student-data.module';
import { CronService } from './cron/cron.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfiguration,
    }),
    CacheModule.register({ isGlobal: true }),
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 5,
    }),
    forwardRef(() => StudentModule),
    forwardRef(() => UploadStudentDataModule),
    forwardRef(() => AdminModule),
    forwardRef(() => HrModule),
    forwardRef(() => AuthModule),
    forwardRef(() => MailModule),
  ],
  providers: [{ provide: APP_GUARD, useClass: AtGuard }, CronService],
})
export class AppModule {}
