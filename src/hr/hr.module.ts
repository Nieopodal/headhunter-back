import { forwardRef, Module } from '@nestjs/common';
import { HrController } from './hr.controller';
import { HrService } from './hr.service';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';
import { AdminService } from '../admin/admin.service';
import { StudentService } from '../student/student.service';
import { JwtService } from '@nestjs/jwt';
import { StudentModule } from '../student/student.module';
import { StudentHrMethodsService } from '../student/student-hr-methods.service';

@Module({
  imports: [forwardRef(() => AuthModule), forwardRef(() => StudentModule)],
  controllers: [HrController],
  providers: [HrService, AuthService, AdminService, StudentHrMethodsService, StudentService, JwtService],
  exports: [HrService],
})
export class HrModule {}
