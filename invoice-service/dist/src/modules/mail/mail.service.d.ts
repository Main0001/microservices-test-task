import { ConfigService } from '@nestjs/config';
import { SendInvoiceOptions } from './interfaces/mail.interfaces';
export declare class MailService {
    private readonly configService;
    private readonly logger;
    private readonly transporter;
    constructor(configService: ConfigService);
    sendInvoice(options: SendInvoiceOptions): Promise<void>;
}
