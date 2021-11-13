import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Store } from './store.entity';
import TransactionType from '../enums/transaction.enum';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Store, (store) => store.transactions)
  store: Store;

  @Column({ type: 'enum', enum: TransactionType })
  type: TransactionType;

  @Column({ type: 'timestamp' })
  date: Date;

  @Column({ type: 'double' })
  value: number;

  @Column({ type: 'int', width: 11 })
  cpf: string;

  @Column({ type: 'int', width: 12 })
  creditCard: string;
}
