import { forwardRef, Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AuthModule } from '../auth/auth.module';
import { UploadStudentDataModule } from '../student/upload-student-data.module';

@Module({
  imports: [forwardRef(() => AuthModule), forwardRef(() => UploadStudentDataModule)],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
