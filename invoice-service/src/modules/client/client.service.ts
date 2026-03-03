import { Injectable } from '@nestjs/common';
import { ClientRepository, ClientWithCompany } from './client.repository';
import { CreateClientDto } from './dto/create-client.dto';

@Injectable()
export class ClientService {
  constructor(private readonly clientRepository: ClientRepository) {}

  async findOrCreate(dto: CreateClientDto): Promise<ClientWithCompany> {
    const existing = await this.clientRepository.findByEmail(dto.email);

    if (existing) {
      return existing;
    }

    return this.clientRepository.create(dto.email);
  }
}
