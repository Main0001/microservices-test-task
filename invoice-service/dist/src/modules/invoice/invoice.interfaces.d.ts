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
