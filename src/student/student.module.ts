import { forwardRef, Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { AuthModule } from '../auth/auth.module';
import { StudentHrMethodsService } from './student-hr-methods.service';

@Module({
  imports: [forwardRef(() => AuthModule)],
  controllers: [StudentController],
  providers: [StudentService, StudentHrMethodsService],
  exports: [StudentService],
})
export class StudentModule {}
