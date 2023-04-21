import { Module } from '@nestjs/common';
import { HeadhunterController } from './headhunter.controller';
import { HeadhunterService } from './headhunter.service';

@Module({
  controllers: [HeadhunterController],
  providers: [HeadhunterService],
})
export class HeadhunterModule {
}
