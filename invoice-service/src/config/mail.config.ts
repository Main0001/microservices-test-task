import { registerAs } from '@nestjs/config';
import * as env from 'env-var';

export default registerAs('mail', () => ({
  host: env.get('MAIL_HOST').required().asString(),
  port: env.get('MAIL_PORT').default('587').asPortNumber(),
  user: env.get('MAIL_USER').required().asString(),
  pass: env.get('MAIL_PASS').required().asString(),
  from: env.get('MAIL_FROM').required().asString(),
}));
