import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

export type ClientWithCompany = Prisma.ClientGetPayload<{
  include: { company: true };
}>;

@Injectable()
export class ClientRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<ClientWithCompany | null> {
    return this.prisma.client.findUnique({
      where: { email },
      include: { company: true },
    });
  }

  async create(email: string): Promise<ClientWithCompany> {
    const [firstName, ...rest] = email.split('@')[0].split('.');
    const lastName = rest.join('.') || 'Unknown';

    return this.prisma.client.create({
      data: {
        email,
        firstName: firstName.charAt(0).toUpperCase() + firstName.slice(1),
        lastName: lastName.charAt(0).toUpperCase() + lastName.slice(1),
      },
      include: { company: true },
    });
  }
}
