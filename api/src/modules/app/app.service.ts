import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Store } from '../../entities/store.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AppService {
  constructor(@InjectRepository(Store) private storeRepo: Repository<Store>) {}
  ping(): { message: string } {
    return { message: 'Pong!' };
  }

  async getStores() {
    const stores = await this.storeRepo.find();

    return stores;
  }

  async getTransactions(storeId) {
    const store = await this.storeRepo.findOne(storeId, {
      relations: ['transactions'],
    });

    if (!store) return [];

    return store.transactions;
  }
}
