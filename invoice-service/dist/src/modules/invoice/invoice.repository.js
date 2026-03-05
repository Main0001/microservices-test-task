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
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let InvoiceRepository = class InvoiceRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.invoice.create({
            data: {
                invoiceNumber: data.invoiceNumber,
                clientId: data.clientId,
                clientEmail: data.clientEmail,
                totalAmount: data.totalAmount,
                items: {
                    create: data.items,
                },
            },
        });
    }
    async findAll(skip, take) {
        return this.prisma.invoice.findMany({
            skip,
            take,
            orderBy: { createdAt: 'desc' },
            include: { items: true, client: true },
        });
    }
    async findById(id) {
        return this.prisma.invoice.findUniqueOrThrow({
            where: { id },
            include: { items: true, client: { include: { company: true } } },
        });
    }
    async count() {
        return this.prisma.invoice.count();
    }
    async updateStatus(id, status) {
        await this.prisma.invoice.update({
            where: { id },
            data: { status },
        });
    }
};
exports.InvoiceRepository = InvoiceRepository;
exports.InvoiceRepository = InvoiceRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InvoiceRepository);
//# sourceMappingURL=invoice.repository.js.map