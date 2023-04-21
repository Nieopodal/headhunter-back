import { Test, TestingModule } from '@nestjs/testing';
import { HeadHunterService } from './head-hunter.service';

describe('HeadHunterService', () => {
  let service: HeadHunterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HeadHunterService],
    }).compile();

    service = module.get<HeadHunterService>(HeadHunterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
