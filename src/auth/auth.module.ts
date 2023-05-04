import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AdminModule } from '../admin/admin.module';
import { HrModule } from '../hr/hr.module';
import { StudentModule } from '../student/student.module';
import { JwtModule } from '@nestjs/jwt';
import { AtStrategy, RtStrategy } from './strategies';

@Module({
  imports: [
    forwardRef(() => AdminModule),
    forwardRef(() => StudentModule),
    forwardRef(() => HrModule),
    forwardRef(() => JwtModule.register({})),
  ],
  controllers: [AuthController],
  providers: [AuthService, AtStrategy, RtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
