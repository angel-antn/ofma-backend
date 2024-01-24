import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';

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

  @IsBoolean()
  @IsOptional()
  isShown: boolean = true;

  @IsString()
  @IsUUID()
  bankId: string;
}
