import { Injectable } from '@nestjs/common';
import { CreateTransferBankAccountDto } from './dto/create-transfer-bank-account.dto';
import { UpdateTransferBankAccountDto } from './dto/update-transfer-bank-account.dto';
import { CreateMobilePayBankAccountDto } from './dto/create-mobile-pay-bank-account.dto';
import { UpdateMobilePayBankAccountDto } from './dto/update-mobile-pay-bank-account.dto';
import { CreateZelleBankAccountDto } from './dto/create-zelle-bank-account.dto';
import { UpdateZelleBankAccountDto } from './dto/update-zelle-bank-account.dto';

@Injectable()
export class BankAccountService {
  //transfer

  createTransferAccount(
    createTransferBankAccountDto: CreateTransferBankAccountDto,
  ) {
    return createTransferBankAccountDto;
  }

  findAllTransferAccount() {
    return `This action returns all bankAccount`;
  }

  findOneTransferAccount(id: string) {
    return `This action returns a #${id} bankAccount`;
  }

  updateTransferAccount(
    id: string,
    updateTransferBankAccountDto: UpdateTransferBankAccountDto,
  ) {
    return updateTransferBankAccountDto;
  }

  removeTransferAccount(id: string) {
    return `This action removes a #${id} bankAccount`;
  }

  //mobile pay

  createMobilePayAccount(
    createMobilePayBankAccountDto: CreateMobilePayBankAccountDto,
  ) {
    return createMobilePayBankAccountDto;
  }

  findAllMobilePayAccount() {
    return `This action returns all bankAccount`;
  }

  findOneMobilePayAccount(id: string) {
    return `This action returns a #${id} bankAccount`;
  }

  updateMobilePayAccount(
    id: string,
    updateMobilePayBankAccountDto: UpdateMobilePayBankAccountDto,
  ) {
    return updateMobilePayBankAccountDto;
  }

  removeMobilePayAccount(id: string) {
    return `This action removes a #${id} bankAccount`;
  }

  //zelle

  createZelleAccount(createZelleBankAccountDto: CreateZelleBankAccountDto) {
    return createZelleBankAccountDto;
  }

  findAllZelleAccount() {
    return `This action returns all bankAccount`;
  }

  findOneZelleAccount(id: string) {
    return `This action returns a #${id} bankAccount`;
  }

  updateZelleAccount(
    id: string,
    updateZelleBankAccountDto: UpdateZelleBankAccountDto,
  ) {
    return updateZelleBankAccountDto;
  }

  removeZelleAccount(id: string) {
    return `This action removes a #${id} bankAccount`;
  }
}
