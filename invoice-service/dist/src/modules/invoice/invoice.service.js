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
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceService = void 0;
const common_1 = require("@nestjs/common");
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("bullmq");
const invoice_repository_1 = require("./invoice.repository");
const client_service_1 = require("../client/client.service");
let InvoiceService = class InvoiceService {
    invoiceRepository;
    clientService;
    pdfQueue;
    constructor(invoiceRepository, clientService, pdfQueue) {
        this.invoiceRepository = invoiceRepository;
        this.clientService = clientService;
        this.pdfQueue = pdfQueue;
    }
    async create(dto) {
        const client = await this.clientService.findOrCreate({ email: dto.email });
        const invoiceNumber = await this.generateInvoiceNumber();
        const totalAmount = dto.items.reduce((sum, item) => sum + item.amount, 0);
        const invoice = await this.invoiceRepository.create({
            invoiceNumber,
            clientId: client.id,
            clientEmail: dto.email,
            totalAmount,
            items: dto.items,
        });
        await this.pdfQueue.add('generate', { invoiceId: invoice.id }, {
            attempts: 3,
            backoff: { type: 'exponential', delay: 2000 },
        });
        return {
            invoiceId: invoice.id,
            invoiceNumber: invoice.invoiceNumber,
            status: invoice.status,
            message: 'Invoice is being processed',
        };
    }
    async findAll(page, limit) {
        const skip = (page - 1) * limit;
        const [items, total] = await Promise.all([
            this.invoiceRepository.findAll(skip, limit),
            this.invoiceRepository.count(),
        ]);
        return { items, total, page, limit };
    }
    async findOne(id) {
        return this.invoiceRepository.findById(id);
    }
    async generateInvoiceNumber() {
        const year = new Date().getFullYear();
        const count = await this.invoiceRepository.count();
        const sequence = String(count + 1).padStart(4, '0');
        return `INV-${year}-${sequence}`;
    }
};
exports.InvoiceService = InvoiceService;
exports.InvoiceService = InvoiceService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, bullmq_1.InjectQueue)('pdf-generation')),
    __metadata("design:paramtypes", [invoice_repository_1.InvoiceRepository,
        client_service_1.ClientService,
        bullmq_2.Queue])
], InvoiceService);
//# sourceMappingURL=invoice.service.js.map