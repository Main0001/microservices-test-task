import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { MailService } from './mail.service';
import { MailProcessor } from './mail.processor';
import { InvoiceModule } from '../invoice/invoice.module';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'email-sending' }),
    InvoiceModule,
  ],
  providers: [MailService, MailProcessor],
})
export class MailModule {}
