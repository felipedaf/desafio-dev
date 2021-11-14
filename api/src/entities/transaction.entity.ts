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

  @Column({ type: 'varchar' })
  cpf: string;

  @Column({ type: 'varchar', length: 12 })
  creditCard: string;
}
