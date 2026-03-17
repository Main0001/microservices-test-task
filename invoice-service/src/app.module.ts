import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import config from './config/config';
import { PrismaModule } from './prisma/prisma.module';
import { ClientModule } from './modules/client/client.module';
import { InvoiceModule } from './modules/invoice/invoice.module';
import { PdfModule } from './modules/pdf/pdf.module';
import { MailModule } from './modules/mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.get<string>('config.redis.host'),
          port: config.get<number>('config.redis.port'),
        },
      }),
    }),
    PrismaModule,
    ClientModule,
    InvoiceModule,
    PdfModule,
    MailModule,
  ],
})
export class AppModule {}
