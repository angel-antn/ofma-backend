import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UseTicketDto } from './dto/use-ticket.dto';
import { Order } from 'src/order/entities/order.entity';
import { Concert } from 'src/concert/entities/concert.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
  ) {}

  async create(ticketQty: number, order: Order, concert: Concert) {
    try {
      const tickets: Ticket[] = [];
      for (let i = 0; i < ticketQty; i++) {
        tickets.push(
          this.ticketRepository.create({
            concert,
            order,
          }),
        );
      }

      await this.ticketRepository.insert(tickets);
      return order;
    } catch (err) {
      this.handleExceptions(err);
    }
  }

  async findAllByUser(userId: string) {
    let result = await this.ticketRepository.find({
      where: {
        order: { user: { id: userId }, status: 'verificado' },
        concert: { hasFinish: false, isActive: true },
      },
      relations: {
        concert: true,
      },
    });

    result = result.map((ticket) => {
      const { ...ticketData } = ticket;
      delete ticketData.concert;
      let { concert } = ticket;
      concert = {
        ...concert,
        imageUrl: `${process.env.HOST_API}/file/concert/${concert.id}.webp`,
      } as any;
      return { concert, ...ticketData };
    });

    return { totalCount: result.length, result };
  }

  async useTicket(useTicketDto: UseTicketDto) {
    const { id } = useTicketDto;
    const ticket: Ticket = await this.findOne(id);
    if (!ticket || ticket.isUsed == true) {
      throw new BadRequestException('not valid ticket');
    } else {
      const usedTicket = await this.ticketRepository.preload({
        id,
        isUsed: true,
      });

      try {
        const response = await this.ticketRepository.save(usedTicket);
        return { ...response, concert: ticket.concert };
      } catch (err) {
        this.handleExceptions(err);
      }
    }
  }

  async countAllPerConcert(concert: Concert) {
    const count = await this.ticketRepository.count({
      where: {
        order: { status: In(['verificado', 'pendiente']) },
        concert: { id: concert.id },
      },
      relations: {
        concert: true,
      },
    });
    return count;
  }

  private async findOne(id: string) {
    const result = await this.ticketRepository.findOne({
      where: { id },
      relations: { concert: true },
    });

    return result;
  }

  private handleExceptions(err): never {
    if (err.code == '23505') {
      throw new BadRequestException(err.detail);
    }
    console.log(err);
    throw new InternalServerErrorException('server failed, check the logs!');
  }
}
