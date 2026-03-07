import { InvoiceStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateInvoiceData } from './interfaces/invoice.interfaces';
import { InvoiceWithItems, InvoiceWithDetails } from './types/invoice.types';
export declare class InvoiceRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: CreateInvoiceData): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        clientId: string | null;
        invoiceNumber: string;
        clientEmail: string;
        status: import("@prisma/client").$Enums.InvoiceStatus;
        totalAmount: import("@prisma/client-runtime-utils").Decimal;
        issuedAt: Date;
    }>;
    findAll(skip: number, take: number): Promise<InvoiceWithItems[]>;
    findById(id: string): Promise<InvoiceWithDetails>;
    count(): Promise<number>;
    updateStatus(id: string, status: InvoiceStatus): Promise<void>;
}
