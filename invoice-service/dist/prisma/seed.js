"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    await prisma.client.upsert({
        where: { email: 'john.doe@example.com' },
        update: {},
        create: {
            email: 'john.doe@example.com',
            firstName: 'John',
            lastName: 'Doe',
            company: {
                create: {
                    name: 'Doe Enterprises',
                    address: '456 Business Ave, New York, NY 10001',
                    phone: '+1 212 555 0101',
                },
            },
        },
    });
    await prisma.client.upsert({
        where: { email: 'jane.smith@example.com' },
        update: {},
        create: {
            email: 'jane.smith@example.com',
            firstName: 'Jane',
            lastName: 'Smith',
            company: {
                create: {
                    name: 'Smith & Co',
                    address: '789 Commerce St, Los Angeles, CA 90001',
                    phone: '+1 310 555 0202',
                },
            },
        },
    });
    console.log('Seed completed');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(() => prisma.$disconnect());
//# sourceMappingURL=seed.js.map