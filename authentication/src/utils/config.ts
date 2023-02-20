import dotenv from 'dotenv';

dotenv.config();

export default {
  PORT: (process.env.PORT as string) || '8080',
  URL: (process.env.URL as string) || 'http://localhost'
};
