import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BankAccountService } from './bank-account.service';
import { CreateTransferBankAccountDto } from './dto/create-transfer-bank-account.dto';
import { UpdateTransferBankAccountDto } from './dto/update-transfer-bank-account.dto';
import { UpdateMobilePayBankAccountDto } from './dto/update-mobile-pay-bank-account.dto';
import { UpdateZelleBankAccountDto } from './dto/update-zelle-bank-account.dto';

@Controller('bank-account')
export class BankAccountController {
  constructor(private readonly bankAccountService: BankAccountService) {}

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
  findAllTransferAccount() {
    return this.bankAccountService.findAllTransferAccount();
  }

  @Get('transfer/:id')
  findOneTransferAccount(@Param('id') id: string) {
    return this.bankAccountService.findOneTransferAccount(id);
  }

  @Patch('transfer/:id')
  updateTransferAccount(
    @Param('id') id: string,
    @Body() updateTransferBankAccountDto: UpdateTransferBankAccountDto,
  ) {
    return this.bankAccountService.updateTransferAccount(
      id,
      updateTransferBankAccountDto,
    );
  }

  @Delete('transfer/:id')
  removeTransferAccount(@Param('id') id: string) {
    return this.bankAccountService.removeTransferAccount(id);
  }

  //mobile pay

  @Post('mobile-pay')
  createMobilePayAccount(
    @Body() createBankAccountDto: CreateTransferBankAccountDto,
  ) {
    return this.bankAccountService.createMobilePayAccount(createBankAccountDto);
  }

  @Get('mobile-pay')
  findAllMobilePayAccount() {
    return this.bankAccountService.findAllMobilePayAccount();
  }

  @Get('mobile-pay/:id')
  findOneMobilePayAccount(@Param('id') id: string) {
    return this.bankAccountService.findOneMobilePayAccount(id);
  }

  @Patch('mobile-pay/:id')
  updateMobilePayAccount(
    @Param('id') id: string,
    @Body() updateMobilePayBankAccountDto: UpdateMobilePayBankAccountDto,
  ) {
    return this.bankAccountService.updateMobilePayAccount(
      id,
      updateMobilePayBankAccountDto,
    );
  }

  @Delete('mobile-pay/:id')
  removeMobilePayAccount(@Param('id') id: string) {
    return this.bankAccountService.removeMobilePayAccount(id);
  }

  //zelle

  @Post('zelle')
  createZelleAccount(
    @Body() createBankAccountDto: CreateTransferBankAccountDto,
  ) {
    return this.bankAccountService.createZelleAccount(createBankAccountDto);
  }

  @Get('zelle')
  findAllZelleAccount() {
    return this.bankAccountService.findAllZelleAccount();
  }

  @Get('zelle/:id')
  findOneZelleAccount(@Param('id') id: string) {
    return this.bankAccountService.findOneZelleAccount(id);
  }

  @Patch('zelle/:id')
  updateZelleAccount(
    @Param('id') id: string,
    @Body() updateZelleBankAccountDto: UpdateZelleBankAccountDto,
  ) {
    return this.bankAccountService.updateZelleAccount(
      id,
      updateZelleBankAccountDto,
    );
  }

  @Delete('zelle/:id')
  removeZelleAccount(@Param('id') id: string) {
    return this.bankAccountService.removeZelleAccount(id);
  }
}