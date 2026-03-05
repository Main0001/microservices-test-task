import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './invoice.service';
import { InvoiceRepository } from './invoice.repository';
import { ClientModule } from '../client/client.module';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'pdf-generation' }),
    ClientModule,
  ],
  controllers: [InvoiceController],
  providers: [InvoiceRepository, InvoiceService],
  exports: [InvoiceRepository],
})
export class InvoiceModule {}
