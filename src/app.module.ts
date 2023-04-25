import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseConfiguration } from './config/typeorm.config';
import { StudentModule } from './student/student.module';
import { AdminModule } from './admin/admin.module';
import { HrModule } from './hr/hr.module';
import {MailModule} from "./mail/mail.module";
import { InitStudentDataModule } from './init-student-data/init-student-data.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfiguration,
    }),
    forwardRef(() => StudentModule),
    forwardRef(() => AdminModule),
    forwardRef(() => HrModule),
    forwardRef(() => InitStudentDataModule),
    
    forwardRef(() => MailModule),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
