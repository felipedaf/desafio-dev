import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Store } from '../../entities/store.entity';
import { Transaction } from '../../entities/transaction.entity';
import TransactionType from '../../enums/transaction.enum';
import builder from '../../utils/cnab/builder';
import { Repository } from 'typeorm';

@Injectable()
export class CnabService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepo: Repository<Transaction>,
    @InjectRepository(Store)
    private storeRepo: Repository<Store>,
  ) {}

  async upload(file) {
    const content = file.buffer.toString('utf-8');
    const transactions = builder(content);

    const insertableTransactions = [];

    const negativeTransactions = [
      TransactionType.BANK_SLIP,
      TransactionType.FINANCING,
      TransactionType.RENT,
    ];

    for (const transaction of transactions) {
      let store = await this.storeRepo.findOne({
        where: {
          name: transaction.store.name,
        },
      });

      if (!store) {
        const newStore = new Store();
        newStore.balance = 0;
        newStore.name = transaction.store.name;
        newStore.owner = transaction.store.owner;
        try {
          store = await this.storeRepo.save(newStore);
        } catch {}
      }

      const newTransaction = new Transaction();

      newTransaction.cpf = transaction.cpf;
      newTransaction.creditCard = transaction.creditCard;
      newTransaction.date = transaction.timestamp;
      newTransaction.store = store;
      newTransaction.type = transaction.type;
      newTransaction.value = transaction.value;

      insertableTransactions.push(newTransaction);

      let transactionValue = transaction.value;

      if (negativeTransactions.includes(transaction.type))
        transactionValue = -transactionValue;

      store.balance += transactionValue;

      await this.storeRepo.save(store);
    }

    await this.transactionRepo.save(insertableTransactions);

    return { message: 'Upload successfully done!' };
  }
}
