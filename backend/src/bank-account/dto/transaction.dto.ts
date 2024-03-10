import { IsNotEmpty } from 'class-validator';

export class TransactionDto {
  @IsNotEmpty()
  source_account: string;

  @IsNotEmpty()
  target_account: string;

  @IsNotEmpty()
  amount: number;
}
