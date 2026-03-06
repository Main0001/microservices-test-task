import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { InvoiceStatus } from '@prisma/client';
import { InvoiceRepository } from '../invoice/invoice.repository';
import { MailService } from './mail.service';

@Processor('email-sending')
export class MailProcessor extends WorkerHost {
  private readonly logger = new Logger(MailProcessor.name);

  constructor(
    private readonly invoiceRepository: InvoiceRepository,
    private readonly mailService: MailService,
  ) {
    super();
  }

  /**
   * Processes a job from the email-sending queue.
   * Decodes the base64 PDF, sends the invoice email, and updates invoice status.
   * On failure, marks the invoice as FAILED and re-throws for BullMQ retry.
   * @param job - BullMQ job containing invoice ID, email, number, and PDF as base64
   */
  async process(job: Job<{
    invoiceId: string;
    clientEmail: string;
    invoiceNumber: string;
    pdfBuffer: string; // base64
  }>): Promise<void> {
    const { invoiceId, clientEmail, invoiceNumber, pdfBuffer } = job.data;
    this.logger.log(`Sending email for invoice ${invoiceNumber}`);

    try {
      await this.mailService.sendInvoice({
        to: clientEmail,
        invoiceNumber,
        pdfBuffer: Buffer.from(pdfBuffer, 'base64'),
      });

      await this.invoiceRepository.updateStatus(invoiceId, InvoiceStatus.SENT);
      this.logger.log(`Invoice ${invoiceNumber} delivered`);
    } catch (error) {
      await this.invoiceRepository.updateStatus(invoiceId, InvoiceStatus.FAILED);
      this.logger.error(`Failed to deliver ${invoiceNumber}`, error);
      throw error; // BullMQ marks job as failed and retries
    }
  }
}
