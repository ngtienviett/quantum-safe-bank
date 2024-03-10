import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from 'db/data-source';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BankAccountModule } from './bank-account/bank-account.module';
import { UploadModule } from './upload/upload.module';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { UploadController } from './upload/upload.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    UserModule,
    BankAccountModule,
    AuthModule,
    ConfigModule.forRoot(),
    UploadModule,
  ],
  controllers: [AppController, UserController, UploadController],
  providers: [AppService],
})
export class AppModule {}
