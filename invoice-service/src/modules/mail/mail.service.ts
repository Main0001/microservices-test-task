import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    const mail = this.configService.get('mail');
    this.transporter = nodemailer.createTransport({
      host: mail.host,
      port: mail.port,
      auth: { user: mail.user, pass: mail.pass },
    });
  }

  /**
   * Sends an invoice email with the PDF attached via SMTP.
   * @param options.to - Recipient email address
   * @param options.invoiceNumber - Invoice number used in subject and filename
   * @param options.pdfBuffer - PDF file content as a Buffer
   */
  async sendInvoice(options: {
    to: string;
    invoiceNumber: string;
    pdfBuffer: Buffer;
  }): Promise<void> {
    const from = this.configService.get<string>('mail.from');

    await this.transporter.sendMail({
      from,
      to: options.to,
      subject: `Invoice ${options.invoiceNumber}`,
      text: `Please find attached your invoice ${options.invoiceNumber}.`,
      html: `<p>Please find attached your invoice <strong>${options.invoiceNumber}</strong>.</p>`,
      attachments: [
        {
          filename: `${options.invoiceNumber}.pdf`,
          content: options.pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    });

    this.logger.log(`Email sent to ${options.to} for ${options.invoiceNumber}`);
  }
}
