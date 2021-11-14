import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from '../../entities/store.entity';
import { Transaction } from '../../entities/transaction.entity';
import { CnabModule } from '../cnab/cnab.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import databaseConfig from '../../database/config';
import * as dotenv from 'dotenv';

let app: INestApplication;

describe('AppController', () => {
  let appController: AppController;
  dotenv.config();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          ...databaseConfig(),
          entities: ['./**/*.entity{.ts, .js}'],
        }),
        TypeOrmModule.forFeature([Store, Transaction]),
      ],
      controllers: [AppController],
      providers: [AppService],
    }).compile();
    app = module.createNestApplication();
    await app.init();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Pong!"', () => {
      expect(appController.ping()).toEqual({ message: 'Pong!' });
    });
  });
});
