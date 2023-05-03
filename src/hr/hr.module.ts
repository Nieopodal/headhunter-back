import { forwardRef, Module } from '@nestjs/common';
import { HrController } from './hr.controller';
import { HrService } from './hr.service';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';
import { AdminService } from '../admin/admin.service';
import { StudentService } from '../student/student.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [forwardRef(() => AuthModule)],
  controllers: [HrController],
  providers: [HrService, AuthService, AdminService, StudentService, JwtService],
  exports: [HrService],
})
export class HrModule {
}
