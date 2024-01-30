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
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { TicketService } from 'src/ticket/ticket.service';
import { ConcertService } from 'src/concert/concert.service';
import { Concert } from 'src/concert/entities/concert.entity';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly bankAccountService: BankAccountService,
    private readonly userService: UserService,
    private readonly exchangeRateService: ExchangeRateService,
    private readonly ticketService: TicketService,
    private readonly concertService: ConcertService,
    private readonly httpService: HttpService,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const {
      exchangeRateId,
      userId,
      mobilePayBankAccountId,
      transferBankAccountId,
      zelleBankAccountId,
      ticketQty,
      concertId,
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

    let createTickets: boolean = false;
    let concert: Concert;

    if (createOrderDto.type == 'suscripcion' && cont == 0) {
      await this.userService.makeUserPremium(user.id);
    } else if (createOrderDto.type == 'boleteria') {
      if (!concertId || !ticketQty) {
        throw new BadRequestException(
          'when adquiring tickets, ticketQty and concertId are needed',
        );
      } else {
        concert = await this.concertService.findOne(concertId);
        createTickets = true;
      }
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

      if (createTickets) {
        await this.ticketService.create(ticketQty, order, concert);
      }

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
          transferBankAccount: { bank: true },
          mobilePayBankAccount: { bank: true },
          zelleBankAccount: true,
        },
        order: {
          createdAt: 'DESC',
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
        order: {
          createdAt: 'DESC',
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
        order: {
          createdAt: 'DESC',
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
      order: {
        createdAt: 'DESC',
      },
    });

    return { totalCount: result.length, result };
  }

  async findAllPaginatedByUserId(userId: string, paginationDto: PaginationDto) {
    const { page = 1, pageSize = 5 } = paginationDto;
    const result = await this.orderRepository.find({
      take: pageSize,
      skip: (page - 1) * pageSize,
      where: { user: { id: userId } },
      relations: {
        user: true,
        exchangeRate: true,
        transferBankAccount: true,
        mobilePayBankAccount: true,
        zelleBankAccount: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
    const totalCount = await this.orderRepository.count({
      where: { user: { id: userId } },
    });

    return { totalCount, page, pageSize, result };
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
    const userId = (await this.findOne(id)).user.id;
    try {
      const result = await this.orderRepository.save(order);
      if (
        order.type == 'suscripcion' &&
        updateOrderDto.status == 'verificado'
      ) {
        await this.userService.makeUserPremium(userId);
      }
      try {
        await lastValueFrom(
          this.httpService.post(
            `${process.env.PUSH_HOST}/message?token=${process.env.PUSH_CLIENT_TOKEN}`,
            {
              title: userId,
              message: this.getMessageToPush(id, status),
            },
            {
              headers: {
                Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
                'Content-Type': 'application/x-www-form-urlencoded',
              },
            },
          ),
        );
      } catch (err) {
        console.log(err);
      }
      return result;
    } catch (err) {
      this.handleExceptions(err);
    }
  }

  private getMessageToPush(id: string, status: string) {
    switch (status) {
      case 'verificado':
        return `La orden ${id} fue verificada`;
      case 'rechazado':
        return `La orden ${id} fue rechazada`;
      default:
        return `La orden ${id} ha cambiado de estatus`;
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
