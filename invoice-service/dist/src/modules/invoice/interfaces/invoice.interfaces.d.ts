import { InvoiceWithItems } from '../types/invoice.types';
export interface CreateInvoiceData {
    invoiceNumber: string;
    clientId: string;
    clientEmail: string;
    totalAmount: number;
    items: {
        description: string;
        amount: number;
    }[];
}
export interface PaginatedInvoicesResult {
    items: InvoiceWithItems[];
    total: number;
    page: number;
    limit: number;
}
