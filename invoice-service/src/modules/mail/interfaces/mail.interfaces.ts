export interface SendEmailJobData {
  invoiceId: string;
  clientEmail: string;
  invoiceNumber: string;
  pdfBuffer: string; // base64
}

export interface SendInvoiceOptions {
  to: string;
  invoiceNumber: string;
  pdfBuffer: Buffer;
}
