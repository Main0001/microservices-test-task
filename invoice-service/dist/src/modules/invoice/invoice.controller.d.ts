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
                clientId: string;
                name: string;
                address: string | null;
                phone: string | null;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            firstName: string;
            lastName: string;
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
        invoiceNumber: string;
        clientEmail: string;
        status: import("@prisma/client").$Enums.InvoiceStatus;
        totalAmount: import("@prisma/client-runtime-utils").Decimal;
        issuedAt: Date;
        createdAt: Date;
        updatedAt: Date;
        clientId: string | null;
    }>;
}
