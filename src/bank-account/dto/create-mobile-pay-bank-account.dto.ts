import { IsString, IsUUID } from 'class-validator';

export class CreateMobilePayBankAccountDto {
  @IsString()
  accountAlias: string;

  @IsString()
  accountHolderPhone: string;

  @IsString()
  accountHolderDocument: string;

  @IsString()
  @IsUUID()
  bankId: string;
}
