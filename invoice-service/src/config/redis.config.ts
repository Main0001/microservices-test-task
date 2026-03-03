import { registerAs } from '@nestjs/config';
import * as env from 'env-var';

export default registerAs('redis', () => ({
  host: env.get('REDIS_HOST').required().asString(),
  port: env.get('REDIS_PORT').default('6379').asPortNumber(),
}));
