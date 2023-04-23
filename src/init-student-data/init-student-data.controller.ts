import { Controller } from '@nestjs/common';
import { InitStudentDataService } from './init-student-data.service';

@Controller('init-student-data')
export class InitStudentDataController {
  constructor(private readonly initStudentDataService: InitStudentDataService) {}
}
