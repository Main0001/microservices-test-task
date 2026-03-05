import { Processor, WorkerHost } from '@nestjs/bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { Job, Queue } from 'bullmq';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InvoiceStatus } from '@prisma/client';
import { InvoiceRepository } from '../invoice/invoice.repository';
import { PdfService } from './pdf.service';

@Processor('pdf-generation')
export class PdfProcessor extends WorkerHost {
  private readonly logger = new Logger(PdfProcessor.name);

  constructor(
    private readonly invoiceRepository: InvoiceRepository,
    private readonly pdfService: PdfService,
    private readonly configService: ConfigService,
    @InjectQueue('email-sending') private readonly mailQueue: Queue,
  ) {
    super();
  }

  async process(job: Job<{ invoiceId: string }>): Promise<void> {
    const { invoiceId } = job.data;
    this.logger.log(`Generating PDF for invoice ${invoiceId}`);

    // 1. Fetch invoice data from DB
    const invoice = await this.invoiceRepository.findById(invoiceId);

    // 2. Generate PDF
    const pdfBuffer = await this.pdfService.generate({
      sender: this.configService.get('app.sender')!,
      client: { firstName: invoice.client!.firstName, lastName: invoice.client!.lastName },
      company: invoice.client!.company,
      invoice: { invoiceNumber: invoice.invoiceNumber, issuedAt: invoice.issuedAt },
      items: invoice.items.map((i) => ({ description: i.description, amount: Number(i.amount) })),
      totalAmount: Number(invoice.totalAmount),
    });

    // 3. Update status → PROCESSING
    await this.invoiceRepository.updateStatus(invoiceId, InvoiceStatus.PROCESSING);

    // 4. Pass job to email-sending queue (Buffer → base64 for JSON serialization)
    await this.mailQueue.add('send', {
      invoiceId,
      clientEmail: invoice.clientEmail,
      invoiceNumber: invoice.invoiceNumber,
      pdfBuffer: pdfBuffer.toString('base64'),
    });

    this.logger.log(`PDF generated, queued for email: ${invoiceId}`);
  }
}
