import { InvoiceStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
export type InvoiceWithItems = Prisma.InvoiceGetPayload<{
    include: {
        items: true;
        client: true;
    };
}>;
export type InvoiceWithDetails = Prisma.InvoiceGetPayload<{
    include: {
        items: true;
        client: {
            include: {
                company: true;
            };
        };
    };
}>;
export declare class InvoiceRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: {
        invoiceNumber: string;
        clientId: string;
        clientEmail: string;
        totalAmount: number;
        items: {
            description: string;
            amount: number;
        }[];
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        clientId: string | null;
        invoiceNumber: string;
        clientEmail: string;
        status: import("@prisma/client").$Enums.InvoiceStatus;
        totalAmount: Prisma.Decimal;
        issuedAt: Date;
    }>;
    findAll(skip: number, take: number): Promise<InvoiceWithItems[]>;
    findById(id: string): Promise<InvoiceWithDetails>;
    count(): Promise<number>;
    updateStatus(id: string, status: InvoiceStatus): Promise<void>;
}
