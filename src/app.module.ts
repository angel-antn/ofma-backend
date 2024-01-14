import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from './user/user.module';
import { AdminUserModule } from './admin-user/admin-user.module';
import { MusicianModule } from './musician/musician.module';
import { ConcertModule } from './concert/concert.module';
import { ExclusiveContentModule } from './exclusive-content/exclusive-content.module';
import { CommonModule } from './common/common.module';
import { FileModule } from './file/file.module';
import { BankAccountModule } from './bank-account/bank-account.module';
import { TicketModule } from './ticket/ticket.module';
import { BankModule } from './bank/bank.module';
import { OrderModule } from './order/order.module';
import { ExchangeRateModule } from './exchange-rate/exchange-rate.module';
import { StripeModule } from './stripe/stripe.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true,
    }),
    UserModule,
    AdminUserModule,
    MusicianModule,
    ConcertModule,
    ExclusiveContentModule,
    CommonModule,
    FileModule,
    BankAccountModule,
    TicketModule,
    BankModule,
    OrderModule,
    ExchangeRateModule,
    StripeModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
