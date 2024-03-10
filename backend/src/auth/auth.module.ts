import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankAccountService } from 'src/bank-account/bank-account.service';
import { BankAccount } from 'src/bank-account/entities/bank-account.entity';
import { User } from 'src/user/entities/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, BankAccount]),
    JwtModule.register({
      global: true,
      secret: '123456789',
      signOptions: {
        expiresIn: '1h',
      },
    }),
    ConfigModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, BankAccountService],
})
export class AuthModule {}
