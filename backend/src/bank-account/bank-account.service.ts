import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import { TransactionDto } from './dto/transaction.dto';
import { BankAccount } from './entities/bank-account.entity';

@Injectable()
export class BankAccountService {
  constructor(
    @InjectRepository(BankAccount)
    private bankAccountRepository: Repository<BankAccount>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createBankAccount(
    userId: number,
    createBankAccountDto: CreateBankAccountDto,
  ) {
    const user = await this.userRepository.findOneBy({ id: userId });
    try {
      const res = await this.bankAccountRepository.save({
        ...createBankAccountDto,
        account_balance: 0,
        account_number: await this.generateRandomAccountNumber(),
        user,
      });
      return await this.bankAccountRepository.findOneBy({ id: res.id });
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async findAllBankAccountOfUser(userId: number): Promise<BankAccount[]> {
    const user = await this.userRepository.findOneBy({ id: userId });
    return this.bankAccountRepository.find({ where: { user_id: user.id } });
  }

  async transfer(userId: number, transactionDto: TransactionDto) {
    const user = await this.userRepository.findOneBy({ id: userId });

    const sourceBankAccount = await this.bankAccountRepository.findOneBy({
      user_id: user.id,
      account_number: transactionDto.source_account,
    });

    const targetBankAccount = await this.bankAccountRepository.findOneBy({
      account_number: transactionDto.target_account,
    });

    if (sourceBankAccount.account_balance < transactionDto.amount) {
      throw new HttpException(
        'Account balance is not enough',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!targetBankAccount) {
      throw new HttpException(
        'Target bank account is not exit',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (targetBankAccount.id === sourceBankAccount.id) {
      throw new HttpException(
        'Target bank account can not be your selected account',
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      this.bankAccountRepository.save({
        ...sourceBankAccount,
        account_balance:
          sourceBankAccount.account_balance - transactionDto.amount,
      });

      this.bankAccountRepository.save({
        ...targetBankAccount,
        account_balance:
          targetBankAccount.account_balance + transactionDto.amount,
      });
    } catch (error) {
      throw new HttpException('Can not transfer money', HttpStatus.BAD_REQUEST);
    }
  }

  private async generateRandomAccountNumber(): Promise<string> {
    ``;
    let generatedAccount: string;
    do {
      generatedAccount = Math.floor(
        100000000 + Math.random() * 900000000,
      ).toString();
    } while (await this.isAccountNumberExists(generatedAccount));

    return generatedAccount;
  }

  private async isAccountNumberExists(accountNumber: string): Promise<boolean> {
    const existingRecord = await this.bankAccountRepository.findOne({
      where: { account_number: accountNumber },
    });
    return !!existingRecord;
  }
}
