import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { ConfigService } from '@nestjs/config';
import { Queue } from 'bullmq';
import { InvoiceRepository } from './invoice.repository';
import { InvoiceWithDetails } from './types/invoice.types';
import { ClientService } from '../client/client.service';
import { CreateInvoiceDto, PaginatedInvoicesResult } from './dto/invoice.dto';

@Injectable()
export class InvoiceService {
  constructor(
    private readonly invoiceRepository: InvoiceRepository,
    private readonly clientService: ClientService,
    private readonly configService: ConfigService,
    @InjectQueue('pdf-generation') private readonly pdfQueue: Queue,
  ) {}

  /**
   * Creates a new invoice, saves it to the database, and queues PDF generation.
   * Returns immediately without waiting for PDF — async processing via BullMQ.
   * @param dto - Invoice creation data (client email + line items)
   * @returns Invoice ID, number, status, and processing message
   */
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

    // Add invoice to the queue for async PDF generation
    await this.pdfQueue.add(
      'generate',
      { invoiceId: invoice.id },
      {
        attempts: this.configService.get<number>('config.queue.attempts')!,
        backoff: {
          type: 'exponential',
          delay: this.configService.get<number>('config.queue.backoffDelay')!,
        },
      },
    );

    return {
      invoiceId: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      status: invoice.status,
      message: 'Invoice is being processed',
    };
  }

  /**
   * Returns a paginated list of invoices with items and client info.
   * @param page - Page number (1-based)
   * @param limit - Number of items per page
   * @returns Paginated result with items, total count, page, and limit
   */
  async findAll(page: number, limit: number): Promise<PaginatedInvoicesResult> {
    const skip = (page - 1) * limit;

    // Execute DB queries in parallel for better performance
    const [items, total] = await Promise.all([
      this.invoiceRepository.findAll(skip, limit),
      this.invoiceRepository.count(),
    ]);
    return { items, total, page, limit };
  }

  /**
   * Returns a single invoice by ID with full client and company details.
   * @param id - Invoice UUID
   * @returns Invoice with items, client, and company
   */
  async findOne(id: string): Promise<InvoiceWithDetails> {
    return this.invoiceRepository.findById(id);
  }

  /**
   * Generates a unique sequential invoice number in format INV-YYYY-XXXX.
   * @returns Invoice number string, e.g. "INV-2026-0001"
   */
  private async generateInvoiceNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await this.invoiceRepository.count();

    // Pad sequence number with leading zeros (e.g. 1 → 0001)
    const sequence = String(count + 1).padStart(4, '0');
    return `INV-${year}-${sequence}`;
  }
}
