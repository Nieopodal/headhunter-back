import { Test, TestingModule } from '@nestjs/testing';
import { HeadhunterService } from './headhunter.service';

describe('HeadHunterService', () => {
  let service: HeadhunterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HeadhunterService],
    }).compile();

    service = module.get<HeadhunterService>(HeadhunterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
