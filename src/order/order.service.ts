import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { BankAccountService } from 'src/bank-account/bank-account.service';
import { UserService } from 'src/user/user.service';
import { ExchangeRateService } from 'src/exchange-rate/exchange-rate.service';
import { User } from 'src/user/entities/user.entity';
import { MobilePayBankAccount } from 'src/bank-account/entities/mobile-pay-bank-account.entity';
import { TransferBankAccount } from 'src/bank-account/entities/transfer-bank-account.entity';
import { ZelleBankAccount } from 'src/bank-account/entities/zelle-bank-account.entity';
import { ExchangeRate } from 'src/exchange-rate/entities/exchange-rate.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly bankAccountService: BankAccountService,
    private readonly userService: UserService,
    private readonly exchangeRateService: ExchangeRateService,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const {
      exchangeRateId,
      userId,
      mobilePayBankAccountId,
      transferBankAccountId,
      zelleBankAccountId,
      ...orderData
    } = createOrderDto;

    let user: User;
    let exchangeRate: ExchangeRate;
    let mobilePayBankAccount: MobilePayBankAccount;
    let transferBankAccount: TransferBankAccount;
    let zelleBankAccount: ZelleBankAccount;

    let cont = 0;

    if (mobilePayBankAccountId) {
      cont++;
    }
    if (transferBankAccountId) {
      cont++;
    }
    if (zelleBankAccountId) {
      cont++;
    }

    if (cont > 1) {
      throw new BadRequestException('cant have more than one payment type');
    } else if (cont == 0) {
      user = await this.userService.findOne(userId);
    } else if (zelleBankAccountId) {
      [user, zelleBankAccount] = await Promise.all([
        this.userService.findOne(userId),
        this.bankAccountService.findOneZelleAccount(zelleBankAccountId),
      ]);
    } else if (transferBankAccountId) {
      [user, transferBankAccount, exchangeRate] = await Promise.all([
        this.userService.findOne(userId),
        this.bankAccountService.findOneTransferAccount(transferBankAccountId),
        this.exchangeRateService.get(exchangeRateId),
      ]);
    } else {
      [user, mobilePayBankAccount, exchangeRate] = await Promise.all([
        this.userService.findOne(userId),
        this.bankAccountService.findOneMobilePayAccount(zelleBankAccountId),
        this.exchangeRateService.get(exchangeRateId),
      ]);
    }

    try {
      const order: Order = this.orderRepository.create({
        ...orderData,
        user,
        zelleBankAccount,
        transferBankAccount,
        mobilePayBankAccount,
        exchangeRate,
      });
      await this.orderRepository.save(order);
      return order;
    } catch (err) {
      this.handleExceptions(err);
    }
  }

  async findAll() {
    const [pending, success, failed] = await Promise.all([
      this.orderRepository.find({
        where: { status: 'pendiente' },
        relations: {
          user: true,
          exchangeRate: true,
          transferBankAccount: true,
          mobilePayBankAccount: true,
          zelleBankAccount: true,
        },
      }),
      this.orderRepository.find({
        where: { status: 'verificado' },
        relations: {
          user: true,
          exchangeRate: true,
          transferBankAccount: true,
          mobilePayBankAccount: true,
          zelleBankAccount: true,
        },
      }),
      this.orderRepository.find({
        where: { status: 'rechazado' },
        relations: {
          user: true,
          exchangeRate: true,
          transferBankAccount: true,
          mobilePayBankAccount: true,
          zelleBankAccount: true,
        },
      }),
    ]);

    return { pending, failed, success };
  }

  async findAllByUserId(userId: string) {
    const result = await this.orderRepository.find({
      where: { user: { id: userId } },
      relations: {
        user: true,
        exchangeRate: true,
        transferBankAccount: true,
        mobilePayBankAccount: true,
        zelleBankAccount: true,
      },
    });

    return { totalCount: result.length, result };
  }

  async findOne(id: string) {
    const result = await this.orderRepository.findOne({
      where: { id },
      relations: {
        user: true,
        exchangeRate: true,
        transferBankAccount: true,
        mobilePayBankAccount: true,
        zelleBankAccount: true,
      },
    });

    return result;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    const { status } = updateOrderDto;

    const order = await this.orderRepository.preload({
      id,
      status,
    });

    if (!order) throw new NotFoundException('Order was not found');

    try {
      const result = await this.orderRepository.save(order);
      return result;
    } catch (err) {
      this.handleExceptions(err);
    }
  }

  private handleExceptions(err): never {
    if (err.code == '23505') {
      throw new BadRequestException(err.detail);
    }
    console.log(err);
    throw new InternalServerErrorException('server failed, check the logs!');
  }
}
