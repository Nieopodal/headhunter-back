import { Controller, Get, Patch } from '@nestjs/common';
import { Student } from './entity/student.entity';
import { StudentService } from './student.service';
import { Public } from '../common/decorators';

@Controller('student')
export class StudentController {
  constructor(private studentService: StudentService) {}

  @Get('/one')
  getOneStudent(): Student {
    return null; //this.studentService.getOne()
  }

  @Patch('/update')
  updateUserData(): Student {
    return null; //this.studentService.update()
  }

  @Get('/deactivate')
  deactivate(): void {
    return null; //this.studentService.deactivate()
  }
  @Public()
  @Get('all')
  getAllStudents(): Promise<Student[]> {
    return this.studentService.get();
  }
}
