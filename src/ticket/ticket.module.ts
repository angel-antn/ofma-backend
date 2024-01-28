import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';
import { UserModule } from 'src/user/user.module';
import { CommonModule } from 'src/common/common.module';

@Module({
  controllers: [TicketController],
  providers: [TicketService],
  imports: [TypeOrmModule.forFeature([Ticket]), UserModule, CommonModule],
  exports: [TypeOrmModule, TicketService],
})
export class TicketModule {}
