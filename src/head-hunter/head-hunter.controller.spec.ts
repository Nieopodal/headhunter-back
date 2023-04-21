import { Test, TestingModule } from '@nestjs/testing';
import { HeadHunterController } from './head-hunter.controller';

describe('HeadHunterController', () => {
  let controller: HeadHunterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HeadHunterController],
    }).compile();

    controller = module.get<HeadHunterController>(HeadHunterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
