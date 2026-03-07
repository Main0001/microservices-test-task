import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { InvoiceRepository } from '../invoice/invoice.repository';
import { MailService } from './mail.service';
import { SendEmailJobData } from './interfaces/mail.interfaces';
export declare class MailProcessor extends WorkerHost {
    private readonly invoiceRepository;
    private readonly mailService;
    private readonly logger;
    constructor(invoiceRepository: InvoiceRepository, mailService: MailService);
    process(job: Job<SendEmailJobData>): Promise<void>;
}
