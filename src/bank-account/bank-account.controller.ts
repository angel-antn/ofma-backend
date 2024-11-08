import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { BankAccountService } from './bank-account.service';
import { CreateTransferBankAccountDto } from './dto/create-transfer-bank-account.dto';
import { UpdateTransferBankAccountDto } from './dto/update-transfer-bank-account.dto';
import { UpdateMobilePayBankAccountDto } from './dto/update-mobile-pay-bank-account.dto';
import { UpdateZelleBankAccountDto } from './dto/update-zelle-bank-account.dto';
import { CreateMobilePayBankAccountDto } from './dto/create-mobile-pay-bank-account.dto';
import { CreateZelleBankAccountDto } from './dto/create-zelle-bank-account.dto';
import { ApiTags } from '@nestjs/swagger';
import { GetBankAccountQueriesDto } from './dto/get-bank-account-queries.dto';

@ApiTags('Bank-account')
@Controller('bank-account')
export class BankAccountController {
  constructor(private readonly bankAccountService: BankAccountService) {}

  // all

  @Get()
  findAll(@Query() getBankAccountQueriesDto: GetBankAccountQueriesDto) {
    return this.bankAccountService.findAll(getBankAccountQueriesDto);
  }

  //transfer

  @Post('transfer')
  createTransferAccount(
    @Body() createTransferBankAccountDto: CreateTransferBankAccountDto,
  ) {
    return this.bankAccountService.createTransferAccount(
      createTransferBankAccountDto,
    );
  }

  @Get('transfer')
  findAllTransferAccount(
    @Query() getBankAccountQueriesDto: GetBankAccountQueriesDto,
  ) {
    return this.bankAccountService.findAllTransferAccount(
      getBankAccountQueriesDto,
    );
  }

  @Get('transfer/:id')
  findOneTransferAccount(@Param('id', ParseUUIDPipe) id: string) {
    return this.bankAccountService.findOneTransferAccount(id);
  }

  @Patch('transfer/:id')
  updateTransferAccount(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTransferBankAccountDto: UpdateTransferBankAccountDto,
  ) {
    return this.bankAccountService.updateTransferAccount(
      id,
      updateTransferBankAccountDto,
    );
  }

  @Delete('transfer/:id')
  removeTransferAccount(@Param('id', ParseUUIDPipe) id: string) {
    return this.bankAccountService.removeTransferAccount(id);
  }

  //mobile pay

  @Post('mobile-pay')
  createMobilePayAccount(
    @Body() createMobilePayBankAccountDto: CreateMobilePayBankAccountDto,
  ) {
    return this.bankAccountService.createMobilePayAccount(
      createMobilePayBankAccountDto,
    );
  }

  @Get('mobile-pay')
  findAllMobilePayAccount(
    @Query() getBankAccountQueriesDto: GetBankAccountQueriesDto,
  ) {
    return this.bankAccountService.findAllMobilePayAccount(
      getBankAccountQueriesDto,
    );
  }

  @Get('mobile-pay/:id')
  findOneMobilePayAccount(@Param('id', ParseUUIDPipe) id: string) {
    return this.bankAccountService.findOneMobilePayAccount(id);
  }

  @Patch('mobile-pay/:id')
  updateMobilePayAccount(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateMobilePayBankAccountDto: UpdateMobilePayBankAccountDto,
  ) {
    return this.bankAccountService.updateMobilePayAccount(
      id,
      updateMobilePayBankAccountDto,
    );
  }

  @Delete('mobile-pay/:id')
  removeMobilePayAccount(@Param('id', ParseUUIDPipe) id: string) {
    return this.bankAccountService.removeMobilePayAccount(id);
  }

  //zelle

  @Post('zelle')
  createZelleAccount(
    @Body() createZelleBankAccountDto: CreateZelleBankAccountDto,
  ) {
    return this.bankAccountService.createZelleAccount(
      createZelleBankAccountDto,
    );
  }

  @Get('zelle')
  findAllZelleAccount(
    @Query() getBankAccountQueriesDto: GetBankAccountQueriesDto,
  ) {
    return this.bankAccountService.findAllZelleAccount(
      getBankAccountQueriesDto,
    );
  }

  @Get('zelle/:id')
  findOneZelleAccount(@Param('id', ParseUUIDPipe) id: string) {
    return this.bankAccountService.findOneZelleAccount(id);
  }

  @Patch('zelle/:id')
  updateZelleAccount(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateZelleBankAccountDto: UpdateZelleBankAccountDto,
  ) {
    return this.bankAccountService.updateZelleAccount(
      id,
      updateZelleBankAccountDto,
    );
  }

  @Delete('zelle/:id')
  removeZelleAccount(@Param('id', ParseUUIDPipe) id: string) {
    return this.bankAccountService.removeZelleAccount(id);
  }
}
