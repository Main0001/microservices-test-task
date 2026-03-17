import type { Prisma } from '@prisma/client';

export type InvoiceWithItems = Prisma.InvoiceGetPayload<{
  include: { items: true; client: true };
}>;

export type InvoiceWithDetails = Prisma.InvoiceGetPayload<{
  include: { items: true; client: { include: { company: true } } };
}>;

