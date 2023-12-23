import { PartialType } from '@nestjs/mapped-types';
import { CreateMobilePayBankAccountDto } from './create-mobile-pay-bank-account.dto';

export class UpdateMobilePayBankAccountDto extends PartialType(
  CreateMobilePayBankAccountDto,
) {}
