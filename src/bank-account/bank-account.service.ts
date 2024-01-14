import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateTransferBankAccountDto } from './dto/create-transfer-bank-account.dto';
import { UpdateTransferBankAccountDto } from './dto/update-transfer-bank-account.dto';
import { CreateMobilePayBankAccountDto } from './dto/create-mobile-pay-bank-account.dto';
import { UpdateMobilePayBankAccountDto } from './dto/update-mobile-pay-bank-account.dto';
import { CreateZelleBankAccountDto } from './dto/create-zelle-bank-account.dto';
import { UpdateZelleBankAccountDto } from './dto/update-zelle-bank-account.dto';
import { TransferBankAccount } from './entities/transfer-bank-account.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MobilePayBankAccount } from './entities/mobile-pay-bank-account.entity';
import { ZelleBankAccount } from './entities/zelle-bank-account.entity';
import { BankService } from 'src/bank/bank.service';

@Injectable()
export class BankAccountService {
  constructor(
    @InjectRepository(TransferBankAccount)
    private readonly transferBankAccountRepository: Repository<TransferBankAccount>,
    @InjectRepository(MobilePayBankAccount)
    private readonly mobilePayBankAccountRepository: Repository<MobilePayBankAccount>,
    @InjectRepository(ZelleBankAccount)
    private readonly zelleBankAccountRepository: Repository<ZelleBankAccount>,
    private readonly bankService: BankService,
  ) {}

  // #region transfer

  async createTransferAccount(
    createTransferBankAccountDto: CreateTransferBankAccountDto,
  ) {
    const { bankId, ...transferBankAccountData } = createTransferBankAccountDto;
    const bank = await this.bankService.findOne(bankId);
    try {
      const transferBankAccount: TransferBankAccount =
        this.transferBankAccountRepository.create({
          ...transferBankAccountData,
          bank,
        });
      await this.transferBankAccountRepository.save(transferBankAccount);
      return transferBankAccount;
    } catch (err) {
      this.handleExceptions(err);
    }
  }

  async findAllTransferAccount() {
    const result = await this.transferBankAccountRepository.find({
      where: { isActive: true },
    });

    return { totalCount: result.length, result };
  }

  async findOneTransferAccount(id: string) {
    const result = await this.transferBankAccountRepository.findOneBy({
      id,
      isActive: true,
    });
    if (!result)
      throw new NotFoundException('transfer bank account was not found');
    return result;
  }

  async updateTransferAccount(
    id: string,
    updateTransferBankAccountDto: UpdateTransferBankAccountDto,
  ) {
    const { bankId, ...transferBankAccountData } = updateTransferBankAccountDto;

    const transferBankAccount =
      await this.transferBankAccountRepository.preload({
        id,
        ...transferBankAccountData,
        bank: bankId ? await this.bankService.findOne(bankId) : undefined,
      });

    if (!transferBankAccount)
      throw new NotFoundException('Transfer bank account was not found');

    try {
      const result =
        await this.transferBankAccountRepository.save(transferBankAccount);
      return result;
    } catch (err) {
      this.handleExceptions(err);
    }
  }

  async removeTransferAccount(id: string) {
    const transferBankAccount =
      await this.transferBankAccountRepository.preload({
        id,
        isActive: false,
      });

    if (!transferBankAccount)
      throw new NotFoundException('Transfer bank account was not found');

    const result =
      await this.transferBankAccountRepository.save(transferBankAccount);
    delete result.isActive;
    return result;
  }
  // #endregion

  // #region mobile pay

  async createMobilePayAccount(
    createMobilePayBankAccountDto: CreateMobilePayBankAccountDto,
  ) {
    const { bankId, ...mobilePayBankAccountData } =
      createMobilePayBankAccountDto;
    const bank = await this.bankService.findOne(bankId);
    try {
      const mobileBankAccount: MobilePayBankAccount =
        this.mobilePayBankAccountRepository.create({
          ...mobilePayBankAccountData,
          bank,
        });
      await this.mobilePayBankAccountRepository.save(mobileBankAccount);
      return mobileBankAccount;
    } catch (err) {
      this.handleExceptions(err);
    }
  }

  async findAllMobilePayAccount() {
    const result = await this.mobilePayBankAccountRepository.find({
      where: { isActive: true },
    });

    return { totalCount: result.length, result };
  }

  async findOneMobilePayAccount(id: string) {
    const result = await this.mobilePayBankAccountRepository.findOneBy({
      id,
      isActive: true,
    });
    if (!result)
      throw new NotFoundException('mobile pay bank account was not found');
    return result;
  }

  async updateMobilePayAccount(
    id: string,
    updateMobilePayBankAccountDto: UpdateMobilePayBankAccountDto,
  ) {
    const { bankId, ...mobilePayBankAccountData } =
      updateMobilePayBankAccountDto;

    const mobilePayBankAccount =
      await this.mobilePayBankAccountRepository.preload({
        id,
        ...mobilePayBankAccountData,
        bank: bankId ? await this.bankService.findOne(bankId) : undefined,
      });

    if (!mobilePayBankAccount)
      throw new NotFoundException('Mobile pay bank account was not found');

    try {
      const result =
        await this.mobilePayBankAccountRepository.save(mobilePayBankAccount);
      return result;
    } catch (err) {
      this.handleExceptions(err);
    }
  }

  async removeMobilePayAccount(id: string) {
    const mobilePayBankAccount =
      await this.mobilePayBankAccountRepository.preload({
        id,
        isActive: false,
      });

    if (!mobilePayBankAccount)
      throw new NotFoundException('Mobile pay bank account was not found');

    const result =
      await this.mobilePayBankAccountRepository.save(mobilePayBankAccount);
    delete result.isActive;
    return result;
  }

  // #endregion

  // #region zelle

  async createZelleAccount(
    createZelleBankAccountDto: CreateZelleBankAccountDto,
  ) {
    try {
      const zelleBankAccount: ZelleBankAccount =
        this.zelleBankAccountRepository.create(createZelleBankAccountDto);
      await this.transferBankAccountRepository.save(zelleBankAccount);
      return zelleBankAccount;
    } catch (err) {
      this.handleExceptions(err);
    }
  }

  async findAllZelleAccount() {
    const result = await this.zelleBankAccountRepository.find({
      where: { isActive: true },
    });

    return { totalCount: result.length, result };
  }

  async findOneZelleAccount(id: string) {
    const result = await this.zelleBankAccountRepository.findOneBy({
      id,
      isActive: true,
    });
    if (!result)
      throw new NotFoundException('zelle bank account was not found');
    return result;
  }

  async updateZelleAccount(
    id: string,
    updateZelleBankAccountDto: UpdateZelleBankAccountDto,
  ) {
    const zelleBankAccount = await this.zelleBankAccountRepository.preload({
      id,
      ...updateZelleBankAccountDto,
    });

    if (!zelleBankAccount)
      throw new NotFoundException('zelle bank account was not found');

    try {
      const result =
        await this.zelleBankAccountRepository.save(zelleBankAccount);
      return result;
    } catch (err) {
      this.handleExceptions(err);
    }
  }

  async removeZelleAccount(id: string) {
    const zelleBankAccount = await this.zelleBankAccountRepository.preload({
      id,
      isActive: false,
    });

    if (!zelleBankAccount)
      throw new NotFoundException('zelle bank account was not found');

    const result = await this.zelleBankAccountRepository.save(zelleBankAccount);
    delete result.isActive;
    return result;
  }
  // #endregion

  async findAll() {
    const [transferBankAccounts, mobilePayBankAccounts, zelleBankAccounts] =
      await Promise.all([
        this.findAllTransferAccount(),
        this.findAllTransferAccount(),
        this.findAllTransferAccount(),
      ]);

    return { transferBankAccounts, mobilePayBankAccounts, zelleBankAccounts };
  }

  private handleExceptions(err): never {
    if (err.code == '23505') {
      throw new BadRequestException(err.detail);
    }
    console.log(err);
    throw new InternalServerErrorException('server failed, check the logs!');
  }
}
