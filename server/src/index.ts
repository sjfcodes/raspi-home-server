// Set env variables from .env file
import { config } from 'dotenv';
config();

import { createServer, Server as HttpServer } from 'http';
import { env } from './config/globals';
import { logger } from './config/logger';
import { app } from './api/server';
import { RedisService } from './services/redis';

// Startup
(async function main() {
	try {
		// Connect db
		// logger.info('Initializing ORM connection...');
		// const connection: Connection = await createConnection();

		// Connect redis
		// RedisService.connect();

		const server: HttpServer = createServer(app);

		// Start express server
		server.listen(env.NODE_PORT);

		server.on('listening', () => {
			logger.info(`node server is listening on port ${env.NODE_PORT} in ${env.NODE_ENV} mode`);
		});

		server.on('close', () => {
			// connection.close();
			RedisService.disconnect();
			logger.info('node server closed');
		});
	} catch (err) {
		logger.error((err as Error).stack);
	}
})();
