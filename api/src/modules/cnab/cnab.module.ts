import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from '../../entities/store.entity';
import { Transaction } from '../../entities/transaction.entity';
import { CnabController } from './cnab.controller';
import { CnabService } from './cnab.service';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, Store])],
  controllers: [CnabController],
  providers: [CnabService],
})
export class CnabModule {}
