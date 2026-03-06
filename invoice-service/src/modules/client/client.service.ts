import { Injectable } from '@nestjs/common';
import { ClientRepository, ClientWithCompany } from './client.repository';
import { CreateClientDto } from './dto/create-client.dto';

@Injectable()
export class ClientService {
  constructor(private readonly clientRepository: ClientRepository) {}

  /**
   * Finds an existing client by email or creates a new one if not found.
   * @param dto - DTO containing the client's email address
   * @returns Client with company info
   */
  async findOrCreate(dto: CreateClientDto): Promise<ClientWithCompany> {
    const existing = await this.clientRepository.findByEmail(dto.email);

    if (existing) {
      return existing;
    }

    return this.clientRepository.create(dto.email);
  }
}
