import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from '../../entities/store.entity';
import * as supertest from 'supertest';
import { Repository } from 'typeorm';
import databaseConfig from '../../database/config';
import { CnabModule } from '../cnab/cnab.module';
import * as dotenv from 'dotenv';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Transaction } from '../../entities/transaction.entity';
import TransactionType from '../../enums/transaction.enum';

let app: INestApplication;

describe('appModule', () => {
  let repository: Repository<Store>;
  let transactionRepo: Repository<Transaction>;
  beforeAll(async () => {
    dotenv.config();
    const module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          ...databaseConfig(),
          entities: ['./**/*.entity{.ts, .js}'],
        }),
        CnabModule,
        TypeOrmModule.forFeature([Store, Transaction]),
      ],
      controllers: [AppController],
      providers: [AppService],
    }).compile();
    app = module.createNestApplication();
    await app.init();

    repository = module.get('StoreRepository');
    transactionRepo = module.get('TransactionRepository');
    await transactionRepo.query('DELETE FROM transaction;');
    await repository.query('DELETE FROM store;');
  });

  describe('GET /store', () => {
    it('should return an array of stores', async () => {
      await repository.save([
        {
          name: 'Store 1',
          owner: 'Joao',
          balance: 12,
        },
        {
          name: 'Store 2',
          owner: 'Pedro',
          balance: -623,
        },
      ]);

      const httpAgent = await supertest(app.getHttpServer());
      const { body } = await httpAgent
        .get('/store')
        .set('Accept', 'application/json')
        .expect(200);

      expect(body).toEqual([
        { id: expect.any(Number), name: 'Store 1', owner: 'Joao', balance: 12 },
        {
          id: expect.any(Number),
          name: 'Store 2',
          owner: 'Pedro',
          balance: -623,
        },
      ]);
    });
  });

  describe('GET /transaction/{storeId}', () => {
    it('should return an array of transaction of a store', async () => {
      await repository.save([
        {
          name: 'Store 1',
          owner: 'Joao',
          balance: 12,
        },
        {
          name: 'Store 2',
          owner: 'Pedro',
          balance: -623,
        },
      ]);

      const stores = await repository.find();

      const store = stores[0];
      const now = new Date(Date.now());
      now.setMilliseconds(0);

      await transactionRepo.save({
        store: store,
        type: TransactionType.CREDIT,
        date: now,
        value: 20,
        cpf: '07286839462',
        creditCard: '847392837192',
      });

      const httpAgent = await supertest(app.getHttpServer());
      const { body } = await httpAgent
        .get(`/transaction/${store.id}`)
        .set('Accept', 'application/json')
        .expect(200);

      expect(body).toEqual([
        {
          id: expect.any(Number),
          type: TransactionType.CREDIT,
          date: now.toISOString(),
          value: 20,
          cpf: '07286839462',
          creditCard: '847392837192',
        },
      ]);
    });
  });

  afterEach(async () => {
    await transactionRepo.query('DELETE FROM transaction;');
    await repository.query('DELETE FROM store;');
  });

  afterAll(async () => {
    await app.close();
  });
});
