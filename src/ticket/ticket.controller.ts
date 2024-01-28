import {
  Controller,
  Get,
  Body,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { TicketService } from './ticket.service';
import { UseTicketDto } from './dto/use-ticket.dto';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/common/decorators/auth.decorator';
import { ValidRoles } from 'src/common/enums/valid-roles.enum';

@ApiTags('Ticket')
@Controller('ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Get('user/:id')
  @Auth(ValidRoles.user)
  findAll(@Param('id', ParseUUIDPipe) userId: string) {
    return this.ticketService.findAllByUser(userId);
  }

  @Post('use-ticket')
  @Auth(ValidRoles.user)
  update(@Body() updateTicketDto: UseTicketDto) {
    return this.ticketService.useTicket(updateTicketDto);
  }
}
