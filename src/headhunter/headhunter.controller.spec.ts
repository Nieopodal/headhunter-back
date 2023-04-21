import { Test, TestingModule } from '@nestjs/testing';
import { HeadhunterController } from './headhunter.controller';

describe('HeadHunterController', () => {
  let controller: HeadhunterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HeadhunterController],
    }).compile();

    controller = module.get<HeadhunterController>(HeadhunterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
