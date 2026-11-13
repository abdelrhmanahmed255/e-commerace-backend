import * as dotenv from 'dotenv';
import * as path from 'path';

// Determine environment
const env = process.env.NODE_ENV || 'dev';
const envFile = env === 'prod' ? '.env.prod' : '.env.dev';

dotenv.config({ path: path.resolve(process.cwd(), envFile) });

export const envConfig = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'dev',
  mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecommerce-c46-dev',
  redis: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD || undefined,
  },
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || 'mySuperSecretAccessKey123',
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '1h',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'mySuperSecretRefreshKey456',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  email: {
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_PASS || '',
  },
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || 'sk_test_your_stripe_secret_key',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || 'whsec_your_webhook_secret',
    successUrl: process.env.STRIPE_SUCCESS_URL || 'http://localhost:3000/orders/success',
    cancelUrl: process.env.STRIPE_CANCEL_URL || 'http://localhost:3000/orders/cancel',
  },
};
