import { registerAs } from '@nestjs/config';
import * as env from 'env-var';

export default registerAs('config', () => ({
  app: {
    port: env.get('PORT').default('3000').asPortNumber(),
    nodeEnv: env.get('NODE_ENV').default('development').asString(),
    sender: {
      name: env.get('SENDER_NAME').required().asString(),
      company: env.get('SENDER_COMPANY').required().asString(),
      address: env.get('SENDER_ADDRESS').required().asString(),
      phone: env.get('SENDER_PHONE').required().asString(),
    },
  },
  mail: {
    host: env.get('MAIL_HOST').required().asString(),
    port: env.get('MAIL_PORT').default('587').asPortNumber(),
    user: env.get('MAIL_USER').required().asString(),
    pass: env.get('MAIL_PASS').required().asString(),
    from: env.get('MAIL_FROM').required().asString(),
  },
  redis: {
    host: env.get('REDIS_HOST').required().asString(),
    port: env.get('REDIS_PORT').default('6379').asPortNumber(),
  },
  database: {
    url: env.get('DATABASE_URL').required().asString(),
  },
}));
