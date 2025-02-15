import dotenv from 'dotenv-safe';

dotenv.config({
  allowEmptyValues: true,
  path: `.env.${process.env.NODE_ENV || 'local'}`,
  example: '.env.example',
});

const ENVIRONMENT = process.env.NODE_ENV || 'development';

const MONGO_USERNAME = process.env.MONGO_USERNAME ?? '';
const MONGO_PASSWORD = process.env.MONGO_PASSWORD ?? '';
const MONGO_HOST = process.env.MONGO_HOST ?? '';
const MONGO_PORT = process.env.MONGO_PORT ?? '';
const MONGO_DATABASE = process.env.MONGO_DATABASE ?? '';
const PORT = process.env.PORT ?? '3000';

const MONGO_URL = MONGO_USERNAME && MONGO_PASSWORD
  ? `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DATABASE}`
  : `mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DATABASE}`;

export const config = { 
  environment: ENVIRONMENT,
  mongo: {
    url: MONGO_URL
  },
  port: parseInt(PORT, 10) // convert PORT to number for use in server setup
};