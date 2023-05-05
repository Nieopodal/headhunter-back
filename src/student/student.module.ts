import { forwardRef, Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { AuthModule } from '../auth/auth.module';
import { StudentHrService } from './student-hr.service';

@Module({
  imports: [forwardRef(() => AuthModule)],
  controllers: [StudentController],
  providers: [StudentService, StudentHrService],
  exports: [StudentService],
})
export class StudentModule {
}
