import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from 'src/common/common.module';
import { Order } from './entities/order.entity';
import { ExchangeRateModule } from 'src/exchange-rate/exchange-rate.module';
import { BankAccountModule } from 'src/bank-account/bank-account.module';

@Module({
  controllers: [OrderController],
  providers: [OrderService],
  imports: [
    TypeOrmModule.forFeature([Order]),
    UserModule,
    ExchangeRateModule,
    BankAccountModule,
    CommonModule,
  ],
  exports: [TypeOrmModule, OrderService],
})
export class OrderModule {}
