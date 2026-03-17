import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsArray,
  ArrayNotEmpty,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { InvoiceItemDto } from './invoice-item.dto';
import { InvoiceWithItems } from '../types/invoice.types';

export class CreateInvoiceDto {
  @ApiProperty({ example: 'john.doe@example.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ type: [InvoiceItemDto] })
  @IsArray()
  @ArrayNotEmpty()
  @IsNotEmpty({ each: true })
  @ValidateNested({ each: true })
  @Type(() => InvoiceItemDto)
  items: InvoiceItemDto[];
}

export class CreateInvoiceData {
  invoiceNumber: string;
  clientId: string;
  clientEmail: string;
  totalAmount: number;
  items: { description: string; amount: number }[];
}

export class PaginatedInvoicesResult {
  items: InvoiceWithItems[];
  total: number;
  page: number;
  limit: number;
}
