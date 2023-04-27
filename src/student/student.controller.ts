import { Controller, Get, Patch } from '@nestjs/common';
import { Student } from './entity/student.entity';

// import { StudentService } from './student.service';

@Controller('student')
export class StudentController {
  // constructor(private readonly studentService: StudentService) {}

  @Get('/all')
  getAllStudents(): Student[] {
    return null; //this.studentService.get()
  }

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
}
