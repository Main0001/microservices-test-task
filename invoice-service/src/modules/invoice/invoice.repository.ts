import { Injectable } from '@nestjs/common';
import { InvoiceStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateInvoiceData } from './dto/invoice.dto';
import { InvoiceWithItems, InvoiceWithDetails } from './types/invoice.types';

@Injectable()
export class InvoiceRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Creates a new invoice with associated line items.
   * @param data - Invoice data including client, items, and total amount
   * @returns Created invoice record
   */
  async create(data: CreateInvoiceData) {
    return this.prisma.invoice.create({
      data: {
        invoiceNumber: data.invoiceNumber,
        clientId: data.clientId,
        clientEmail: data.clientEmail,
        totalAmount: data.totalAmount,
        items: {
          create: data.items,
        },
      },
    });
  }

  /**
   * Returns a paginated list of invoices with items and client info.
   * @param skip - Number of records to skip
   * @param take - Number of records to return
   * @returns List of invoices ordered by creation date descending
   */
  async findAll(skip: number, take: number): Promise<InvoiceWithItems[]> {
    return this.prisma.invoice.findMany({
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: { items: true, client: true },
    });
  }

  /**
   * Returns a single invoice with full details including client and company.
   * Throws if the invoice is not found.
   * @param id - Invoice UUID
   * @returns Invoice with items, client, and company
   */
  async findById(id: string): Promise<InvoiceWithDetails> {
    return this.prisma.invoice.findUniqueOrThrow({
      where: { id },
      include: { items: true, client: { include: { company: true } } },
    });
  }

  /**
   * Returns the total count of invoices.
   * Used for pagination and invoice number generation.
   * @returns Total number of invoices
   */
  async count(): Promise<number> {
    return this.prisma.invoice.count();
  }

  /**
   * Updates the status of an invoice.
   * @param id - Invoice UUID
   * @param status - New invoice status
   */
  async updateStatus(id: string, status: InvoiceStatus): Promise<void> {
    await this.prisma.invoice.update({
      where: { id },
      data: { status },
    });
  }
}
