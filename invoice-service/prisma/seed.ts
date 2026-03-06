import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

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

  // Client without a company (freelancer)
  await prisma.client.upsert({
    where: { email: 'carlos.garcia@example.com' },
    update: {},
    create: {
      email: 'carlos.garcia@example.com',
      firstName: 'Carlos',
      lastName: 'Garcia',
    },
  });

  // Client with a company
  await prisma.client.upsert({
    where: { email: 'emily.chen@techcorp.com' },
    update: {},
    create: {
      email: 'emily.chen@techcorp.com',
      firstName: 'Emily',
      lastName: 'Chen',
      company: {
        create: {
          name: 'TechCorp Ltd',
          address: '100 Silicon Valley Blvd, San Francisco, CA 94105',
          phone: '+1 415 555 0303',
        },
      },
    },
  });

  // Client with a company (no phone/address)
  await prisma.client.upsert({
    where: { email: 'mark.taylor@startup.io' },
    update: {},
    create: {
      email: 'mark.taylor@startup.io',
      firstName: 'Mark',
      lastName: 'Taylor',
      company: {
        create: {
          name: 'Startup.io',
        },
      },
    },
  });

  console.log('Seed completed: 5 clients created');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
