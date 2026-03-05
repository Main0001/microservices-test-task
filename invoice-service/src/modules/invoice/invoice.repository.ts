import { Injectable } from '@nestjs/common';
import { InvoiceStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

export type InvoiceWithItems = Prisma.InvoiceGetPayload<{
  include: { items: true; client: true };
}>;

export type InvoiceWithDetails = Prisma.InvoiceGetPayload<{
  include: { items: true; client: { include: { company: true } } };
}>;

@Injectable()
export class InvoiceRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    invoiceNumber: string;
    clientId: string;
    clientEmail: string;
    totalAmount: number;
    items: { description: string; amount: number }[];
  }) {
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

  async findAll(skip: number, take: number): Promise<InvoiceWithItems[]> {
    return this.prisma.invoice.findMany({
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: { items: true, client: true },
    });
  }

  async findById(id: string): Promise<InvoiceWithDetails> {
    return this.prisma.invoice.findUniqueOrThrow({
      where: { id },
      include: { items: true, client: { include: { company: true } } },
    });
  }

  async count(): Promise<number> {
    return this.prisma.invoice.count();
  }

  async updateStatus(id: string, status: InvoiceStatus): Promise<void> {
    await this.prisma.invoice.update({
      where: { id },
      data: { status },
    });
  }
}
