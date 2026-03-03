import { registerAs } from '@nestjs/config';
import * as env from 'env-var';

export default registerAs('app', () => ({
  port: env.get('PORT').default('3000').asPortNumber(),
  nodeEnv: env.get('NODE_ENV').default('development').asString(),
  sender: {
    name: env.get('SENDER_NAME').required().asString(),
    company: env.get('SENDER_COMPANY').required().asString(),
    address: env.get('SENDER_ADDRESS').required().asString(),
    phone: env.get('SENDER_PHONE').required().asString(),
  },
}));
