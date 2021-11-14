import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from '../../entities/store.entity';
import { Transaction } from '../../entities/transaction.entity';
import { CnabController } from './cnab.controller';
import { CnabService } from './cnab.service';
import * as dotenv from 'dotenv';
import databaseConfig from '../../database/config';
import { INestApplication } from '@nestjs/common';
import * as fs from 'fs';
import { Repository } from 'typeorm';
import { delay } from 'rxjs';

let app: INestApplication;

describe('CnabService', () => {
  let service: CnabService;
  let transactionRepo: Repository<Transaction>;
  let storeRepo: Repository<Store>;

  beforeAll(async () => {
    dotenv.config();
    const module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          ...databaseConfig(),
          entities: ['./**/*.entity{.ts, .js}'],
        }),
        TypeOrmModule.forFeature([Store, Transaction]),
      ],
      controllers: [CnabController],
      providers: [CnabService],
    }).compile();

    service = module.get<CnabService>(CnabService);
    app = module.createNestApplication();
    transactionRepo = module.get('TransactionRepository');
    storeRepo = module.get('StoreRepository');
    await transactionRepo.query('DELETE FROM transaction;');
    await storeRepo.query('DELETE FROM store;');
  });

  afterEach(async () => {
    await transactionRepo.query('DELETE FROM transaction;');
    await storeRepo.query('DELETE FROM store;');
  });

  describe('should store all transactions and store on database', () => {
    const file = { buffer: fs.readFileSync('test/files/CNAB.txt') };
    it('Function return', async () => {
      expect(await service.upload(file)).toEqual({
        message: 'Upload successfully done!',
      });
    });

    it('All data inside database', async () => {
      await service.upload(file);
      const stores = await storeRepo.find();
      const transactions = await transactionRepo.find();
      expect(transactions.length).toBeGreaterThan(0);
      expect(stores.length).toBeGreaterThan(0);
    });
  });
});
