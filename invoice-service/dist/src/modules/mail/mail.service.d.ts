import { ConfigService } from '@nestjs/config';
export declare class MailService {
    private readonly configService;
    private readonly logger;
    private readonly transporter;
    constructor(configService: ConfigService);
    sendInvoice(options: {
        to: string;
        invoiceNumber: string;
        pdfBuffer: Buffer;
    }): Promise<void>;
}
