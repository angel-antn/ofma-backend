import { PartialType } from '@nestjs/mapped-types';
import { CreateZelleBankAccountDto } from './create-zelle-bank-account.dto';

export class UpdateZelleBankAccountDto extends PartialType(
  CreateZelleBankAccountDto,
) {}
