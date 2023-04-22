import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AdminModule } from '../admin/admin.module';
import { HrModule } from '../hr/hr.module';
import { StudentModule } from '../student/student.module';

@Module({
  imports: [forwardRef(() => AdminModule), forwardRef(() => StudentModule), forwardRef(() => HrModule)],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
