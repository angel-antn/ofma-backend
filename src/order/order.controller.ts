import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiTags } from '@nestjs/swagger';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Auth } from 'src/common/decorators/auth.decorator';
import { ValidRoles } from 'src/common/enums/valid-roles.enum';

@ApiTags('Order')
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @Auth(ValidRoles.user)
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @Get()
  @Auth(ValidRoles.admin_user)
  findAll() {
    return this.orderService.findAll();
  }

  @Get(':id')
  @Auth(ValidRoles.admin_user)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.orderService.findOne(id);
  }

  @Get('user/:id')
  @Auth(ValidRoles.user)
  findAllByUserId(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.orderService.findAllPaginatedByUserId(id, paginationDto);
  }

  @Patch(':id')
  @Auth(ValidRoles.admin_user)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.orderService.update(id, updateOrderDto);
  }
}
