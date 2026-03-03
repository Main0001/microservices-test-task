import { ClientRepository, ClientWithCompany } from './client.repository';
import { CreateClientDto } from './dto/create-client.dto';
export declare class ClientService {
    private readonly clientRepository;
    constructor(clientRepository: ClientRepository);
    findOrCreate(dto: CreateClientDto): Promise<ClientWithCompany>;
}
