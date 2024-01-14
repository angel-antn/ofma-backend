import { IsString, IsUUID } from 'class-validator';

export class CreateTransferBankAccountDto {
  @IsString()
  accountAlias: string;

  @IsString()
  accountNumber: string;

  @IsString()
  accountHolderName: string;

  @IsString()
  accountHolderEmail: string;

  @IsString()
  accountHolderDocument: string;

  @IsString()
  @IsUUID()
  bankId: string;
}
