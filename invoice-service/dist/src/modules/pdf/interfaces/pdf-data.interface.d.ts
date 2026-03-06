export interface PdfData {
    sender: {
        name: string;
        company: string;
        address: string;
        phone: string;
    };
    client: {
        firstName: string;
        lastName: string;
    };
    company: {
        name: string;
        address?: string | null;
        phone?: string | null;
    } | null;
    invoice: {
        invoiceNumber: string;
        issuedAt: string;
    };
    items: {
        description: string;
        amount: number;
    }[];
    totalAmount: number;
}
