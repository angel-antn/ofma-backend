import { PartialType } from '@nestjs/mapped-types';
import { CreateTransferBankAccountDto } from './create-transfer-bank-account.dto';

export class UpdateTransferBankAccountDto extends PartialType(
  CreateTransferBankAccountDto,
) {}
