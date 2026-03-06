"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MailProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailProcessor = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const invoice_repository_1 = require("../invoice/invoice.repository");
const mail_service_1 = require("./mail.service");
let MailProcessor = MailProcessor_1 = class MailProcessor extends bullmq_1.WorkerHost {
    invoiceRepository;
    mailService;
    logger = new common_1.Logger(MailProcessor_1.name);
    constructor(invoiceRepository, mailService) {
        super();
        this.invoiceRepository = invoiceRepository;
        this.mailService = mailService;
    }
    async process(job) {
        const { invoiceId, clientEmail, invoiceNumber, pdfBuffer } = job.data;
        this.logger.log(`Sending email for invoice ${invoiceNumber}`);
        try {
            await this.mailService.sendInvoice({
                to: clientEmail,
                invoiceNumber,
                pdfBuffer: Buffer.from(pdfBuffer, 'base64'),
            });
            await this.invoiceRepository.updateStatus(invoiceId, client_1.InvoiceStatus.SENT);
            this.logger.log(`Invoice ${invoiceNumber} delivered`);
        }
        catch (error) {
            await this.invoiceRepository.updateStatus(invoiceId, client_1.InvoiceStatus.FAILED);
            this.logger.error(`Failed to deliver ${invoiceNumber}`, error);
            throw error;
        }
    }
};
exports.MailProcessor = MailProcessor;
exports.MailProcessor = MailProcessor = MailProcessor_1 = __decorate([
    (0, bullmq_1.Processor)('email-sending'),
    __metadata("design:paramtypes", [invoice_repository_1.InvoiceRepository,
        mail_service_1.MailService])
], MailProcessor);
//# sourceMappingURL=mail.processor.js.map