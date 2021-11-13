import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Transaction } from './transaction.entity';

@Entity()
export class Store {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true, length: 19 })
  name: string;

  @Column({ type: 'varchar', length: 14 })
  owner: string;

  @Column({ type: 'double' })
  balance: number;

  @OneToMany(() => Transaction, (transaction) => transaction.store)
  transactions: Transaction[];
}
