export interface PdfData {
  sender: { name: string; company: string; address: string; phone: string };
  client: { firstName: string; lastName: string };
  company: { name: string; address?: string; phone?: string } | null;
  invoice: { invoiceNumber: string; issuedAt: Date };
  items: { description: string; amount: number }[];
  totalAmount: number;
}
