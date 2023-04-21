import { Module } from '@nestjs/common';
import { HeadHunterController } from './head-hunter.controller';
import { HeadHunterService } from './head-hunter.service';

@Module({
  controllers: [HeadHunterController],
  providers: [HeadHunterService],
})
export class HeadHunterModule {
}
