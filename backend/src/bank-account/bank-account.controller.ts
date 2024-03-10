import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { BankAccountService } from './bank-account.service';
import { TransactionDto } from './dto/transaction.dto';

@Controller('bank-account')
export class BankAccountController {
  constructor(private bankAccountService: BankAccountService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(
    @Req() req: Request,
    @Body() createBankAccountDto: CreateBankAccountDto,
  ) {
    // console.log('create-bank-account:', req, createBankAccountDto);
    return this.bankAccountService.createBankAccount(
      req['user_data'].id,
      createBankAccountDto,
    );
  }

  @UseGuards(AuthGuard)
  @Get()
  findAllByUser(@Req() req: Request) {
    // console.log('get-bank-accounts:', req);
    return this.bankAccountService.findAllBankAccountOfUser(
      req['user_data'].id,
    );
  }

  @UseGuards(AuthGuard)
  @Post('transfer')
  transfer(@Req() req: Request, @Body() transactionDto: TransactionDto) {
    // console.log('transfer:', req, transactionDto);
    return this.bankAccountService.transfer(
      req['user_data'].id,
      transactionDto,
    );
  }
}
