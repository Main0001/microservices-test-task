export interface SendEmailJobData {
    invoiceId: string;
    clientEmail: string;
    invoiceNumber: string;
    pdfBuffer: string;
}
export interface SendInvoiceOptions {
    to: string;
    invoiceNumber: string;
    pdfBuffer: Buffer;
}
