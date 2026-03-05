import { Queue } from 'bullmq';
import { InvoiceRepository, InvoiceWithDetails, InvoiceWithItems } from './invoice.repository';
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
    findAll(page: number, limit: number): Promise<{
        items: InvoiceWithItems[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: string): Promise<InvoiceWithDetails>;
    private generateInvoiceNumber;
}
