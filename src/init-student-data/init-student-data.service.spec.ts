import { Test, TestingModule } from '@nestjs/testing';
import { InitStudentDataService } from './init-student-data.service';

describe('InitStudentDataService', () => {
  let service: InitStudentDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InitStudentDataService],
    }).compile();

    service = module.get<InitStudentDataService>(InitStudentDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
