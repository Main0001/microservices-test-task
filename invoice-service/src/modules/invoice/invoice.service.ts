import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import {
  InvoiceRepository,
  InvoiceWithDetails,
  InvoiceWithItems,
} from './invoice.repository';
import { ClientService } from '../client/client.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';

@Injectable()
export class InvoiceService {
  constructor(
    private readonly invoiceRepository: InvoiceRepository,
    private readonly clientService: ClientService,
    @InjectQueue('pdf-generation') private readonly pdfQueue: Queue,
  ) {}

  async create(dto: CreateInvoiceDto) {
    const client = await this.clientService.findOrCreate({ email: dto.email });

    const invoiceNumber = await this.generateInvoiceNumber();
    const totalAmount = dto.items.reduce((sum, item) => sum + item.amount, 0);

    const invoice = await this.invoiceRepository.create({
      invoiceNumber,
      clientId: client.id,
      clientEmail: dto.email,
      totalAmount,
      items: dto.items,
    });

    //add invoice in Queue for PDF generation
    await this.pdfQueue.add('generate', { invoiceId: invoice.id });

    return {
      invoiceId: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      status: invoice.status,
      message: 'Invoice is being processed',
    };
  }

  async findAll(
    page: number,
    limit: number,
  ): Promise<{
    items: InvoiceWithItems[];
    total: number;
    page: number;
    limit: number;
  }> {
    const skip = (page - 1) * limit;

    //Execute the longest task in parallel
    const [items, total] = await Promise.all([
      this.invoiceRepository.findAll(skip, limit),
      this.invoiceRepository.count(),
    ]);
    return { items, total, page, limit };
  }

  async findOne(id: string): Promise<InvoiceWithDetails> {
    return this.invoiceRepository.findById(id);
  }

  private async generateInvoiceNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await this.invoiceRepository.count();

    //Add leading zeros 1 = 0001
    const sequence = String(count + 1).padStart(4, '0');
    return `INV-${year}-${sequence}`;
  }
}
