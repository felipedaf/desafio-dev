import { Module } from '@nestjs/common';
import { CnabController } from './cnab.controller';
import { CnabService } from './cnab.service';

@Module({
  imports: [],
  controllers: [CnabController],
  providers: [CnabService],
})
export class CnabModule {}
