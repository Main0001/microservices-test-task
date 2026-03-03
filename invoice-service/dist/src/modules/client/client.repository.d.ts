import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
export type ClientWithCompany = Prisma.ClientGetPayload<{
    include: {
        company: true;
    };
}>;
export declare class ClientRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findByEmail(email: string): Promise<ClientWithCompany | null>;
    create(email: string): Promise<ClientWithCompany>;
}
