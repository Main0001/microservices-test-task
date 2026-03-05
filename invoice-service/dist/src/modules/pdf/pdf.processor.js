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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var PdfProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PdfProcessor = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("@nestjs/bullmq");
const bullmq_3 = require("bullmq");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const client_1 = require("@prisma/client");
const invoice_repository_1 = require("../invoice/invoice.repository");
const pdf_service_1 = require("./pdf.service");
let PdfProcessor = PdfProcessor_1 = class PdfProcessor extends bullmq_1.WorkerHost {
    invoiceRepository;
    pdfService;
    configService;
    mailQueue;
    logger = new common_1.Logger(PdfProcessor_1.name);
    constructor(invoiceRepository, pdfService, configService, mailQueue) {
        super();
        this.invoiceRepository = invoiceRepository;
        this.pdfService = pdfService;
        this.configService = configService;
        this.mailQueue = mailQueue;
    }
    async process(job) {
        const { invoiceId } = job.data;
        this.logger.log(`Generating PDF for invoice ${invoiceId}`);
        const invoice = await this.invoiceRepository.findById(invoiceId);
        const pdfBuffer = await this.pdfService.generate({
            sender: this.configService.get('app.sender'),
            client: { firstName: invoice.client.firstName, lastName: invoice.client.lastName },
            company: invoice.client.company,
            invoice: { invoiceNumber: invoice.invoiceNumber, issuedAt: invoice.issuedAt },
            items: invoice.items.map((i) => ({ description: i.description, amount: Number(i.amount) })),
            totalAmount: Number(invoice.totalAmount),
        });
        await this.invoiceRepository.updateStatus(invoiceId, client_1.InvoiceStatus.PROCESSING);
        await this.mailQueue.add('send', {
            invoiceId,
            clientEmail: invoice.clientEmail,
            invoiceNumber: invoice.invoiceNumber,
            pdfBuffer: pdfBuffer.toString('base64'),
        });
        this.logger.log(`PDF generated, queued for email: ${invoiceId}`);
    }
};
exports.PdfProcessor = PdfProcessor;
exports.PdfProcessor = PdfProcessor = PdfProcessor_1 = __decorate([
    (0, bullmq_1.Processor)('pdf-generation'),
    __param(3, (0, bullmq_2.InjectQueue)('email-sending')),
    __metadata("design:paramtypes", [invoice_repository_1.InvoiceRepository,
        pdf_service_1.PdfService,
        config_1.ConfigService,
        bullmq_3.Queue])
], PdfProcessor);
//# sourceMappingURL=pdf.processor.js.map