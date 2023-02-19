// index.ts
import app from './app';

import { createServer, Server } from 'http';

import { Config, logger } from './utils';

const server: Server = createServer(app);

try {
  server.listen(Config.PORT, (): void => {
    logger.info(`Connected successfully, url: ${Config.URL}:${Config.PORT}`);
  });
} catch (error) {
  logger.error(`Unable to run server.`);
}
