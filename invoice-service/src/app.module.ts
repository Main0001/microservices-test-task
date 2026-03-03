import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import appConfig from './config/app.config';
import mailConfig from './config/mail.config';
import redisConfig from './config/redis.config';
import { PrismaModule } from './prisma/prisma.module';
import { ClientModule } from './modules/client/client.module';
// import { InvoiceModule } from './modules/invoice/invoice.module';
// import { PdfModule } from './modules/pdf/pdf.module';
// import { MailModule } from './modules/mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, mailConfig, redisConfig],
    }),
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.get<string>('redis.host'),
          port: config.get<number>('redis.port'),
        },
      }),
    }),
    PrismaModule,
    ClientModule,
    // InvoiceModule,
    // PdfModule,
    // MailModule,
  ],
})
export class AppModule {}
