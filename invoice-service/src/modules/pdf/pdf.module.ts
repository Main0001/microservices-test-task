import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { PdfService } from './pdf.service';
import { PdfProcessor } from './pdf.processor';
import { InvoiceModule } from '../invoice/invoice.module';

@Module({
  imports: [
    BullModule.registerQueue(
      { name: 'pdf-generation' },
      { name: 'email-sending' },
    ),
    InvoiceModule,
  ],
  providers: [PdfService, PdfProcessor],
})
export class PdfModule {}
