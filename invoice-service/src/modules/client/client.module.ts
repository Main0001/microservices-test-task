import { Module } from '@nestjs/common';
import { ClientRepository } from './client.repository';
import { ClientService } from './client.service';

@Module({
  providers: [ClientRepository, ClientService],
  exports: [ClientService],
})
export class ClientModule {}
