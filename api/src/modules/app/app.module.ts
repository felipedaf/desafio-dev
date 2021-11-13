import 'reflect-metadata';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as dotenv from 'dotenv';
import databaseConfig from '../../database/config';
import { CnabModule } from '../cnab/cnab.module';

dotenv.config();

@Module({
  imports: [TypeOrmModule.forRoot(databaseConfig()), CnabModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
