import { Test, TestingModule } from '@nestjs/testing';
import { InitStudentDataController } from './init-student-data.controller';
import { InitStudentDataService } from './init-student-data.service';

describe('InitStudentDataController', () => {
  let controller: InitStudentDataController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InitStudentDataController],
      providers: [InitStudentDataService],
    }).compile();

    controller = module.get<InitStudentDataController>(InitStudentDataController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
