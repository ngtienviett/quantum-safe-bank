import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class BankAccount {
  @PrimaryGeneratedColumn({})
  id: number;

  @ManyToOne(() => User, (user) => user.bankAccounts)
  user: User;

  @Column({ name: 'user_id' })
  user_id: number;

  @Column({ default: false })
  is_primary: boolean;

  @Column()
  account_balance: number;

  @Column()
  account_number: string;

  @Column({ default: 'ACTIVE' })
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
