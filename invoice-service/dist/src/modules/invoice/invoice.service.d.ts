import { Queue } from 'bullmq';
import { InvoiceRepository } from './invoice.repository';
import { InvoiceWithDetails } from './types/invoice.types';
import { PaginatedInvoicesResult } from './interfaces/invoice.interfaces';
import { ClientService } from '../client/client.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
export declare class InvoiceService {
    private readonly invoiceRepository;
    private readonly clientService;
    private readonly pdfQueue;
    constructor(invoiceRepository: InvoiceRepository, clientService: ClientService, pdfQueue: Queue);
    create(dto: CreateInvoiceDto): Promise<{
        invoiceId: string;
        invoiceNumber: string;
        status: import("@prisma/client").$Enums.InvoiceStatus;
        message: string;
    }>;
    findAll(page: number, limit: number): Promise<PaginatedInvoicesResult>;
    findOne(id: string): Promise<InvoiceWithDetails>;
    private generateInvoiceNumber;
}
