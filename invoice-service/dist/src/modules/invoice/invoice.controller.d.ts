import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
export declare class InvoiceController {
    private readonly invoiceService;
    constructor(invoiceService: InvoiceService);
    create(dto: CreateInvoiceDto): Promise<{
        invoiceId: string;
        invoiceNumber: string;
        status: import("@prisma/client").$Enums.InvoiceStatus;
        message: string;
    }>;
    findAll(page?: number, limit?: number): Promise<{
        items: import("./invoice.repository").InvoiceWithItems[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: string): Promise<{
        client: ({
            company: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                address: string | null;
                phone: string | null;
                clientId: string;
            } | null;
        } & {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            createdAt: Date;
            updatedAt: Date;
        }) | null;
        items: {
            id: string;
            createdAt: Date;
            description: string;
            amount: import("@prisma/client-runtime-utils").Decimal;
            invoiceId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        clientId: string | null;
        invoiceNumber: string;
        clientEmail: string;
        status: import("@prisma/client").$Enums.InvoiceStatus;
        totalAmount: import("@prisma/client-runtime-utils").Decimal;
        issuedAt: Date;
    }>;
}
