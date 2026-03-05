import { WorkerHost } from '@nestjs/bullmq';
import { Job, Queue } from 'bullmq';
import { ConfigService } from '@nestjs/config';
import { InvoiceRepository } from '../invoice/invoice.repository';
import { PdfService } from './pdf.service';
export declare class PdfProcessor extends WorkerHost {
    private readonly invoiceRepository;
    private readonly pdfService;
    private readonly configService;
    private readonly mailQueue;
    private readonly logger;
    constructor(invoiceRepository: InvoiceRepository, pdfService: PdfService, configService: ConfigService, mailQueue: Queue);
    process(job: Job<{
        invoiceId: string;
    }>): Promise<void>;
}
