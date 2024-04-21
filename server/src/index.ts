// Set env variables from .env file
import { config } from 'dotenv';
config();

import { createServer, Server as HttpServer } from 'http';
import { env } from './config/globals';
import { logger } from './services/logger';
import { app } from './api/server';
// import { RedisService } from './services/redis';

/**
 * [NOTE]
 *    SSE on http (update express to http2, or use fastify?)
 *    is limited to 6 connections. If server has 6 active
 *    connections, the next request will jam the server...
 *      checkout: https://github.com/spdy-http2/node-spdy
 *      checkout: https://fastify.dev/docs/v3.29.x/Reference/HTTP2/
 */

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
            logger.info(
                `node server is listening on port ${env.NODE_PORT} in ${env.NODE_ENV} mode`
            );
        });

        server.on('close', () => {
            // connection.close();
            // RedisService.disconnect();
            logger.info('node server closed');
        });
    } catch (err) {
        logger.error(err);
    }
})();

/**
 * --- GLOSSARY ---
 * REMOTE    : manager of a zone's min/max temperature and any component overrides.
 * THERMOSTAT: reports of zone's temperature.
 * HEATER    : manager of a heater's on/off state.
 * ZONE      : group of one heater, termostat, & controller.
 *
 *
 *
 * --- ROUTES ----
 * HEATER
 *     [NOTE]: uses websocket to write heater state changes
 *     PATH: /heater
 *     GET : read heaters
 *
 *     [TODO] PATH: /heater/:id
 *            GET : read one heater
 *
 *     [TODO]: convert heater chip to use
 *             GET  : read sse status stream
 *             PATCH: write heater state
 *
 * REMOTE
 *     PATH: /remote
 *     PUT : write min, max, override to store
 *     GET : read controllers
 *
 *     [TODO] PATH: /remote/:id
 *            GET : read one remote
 *
 * THERMOSTAT
 *     PATH: /thermometer
 *     POST: write temperature to store
 *     GET : read thermometers
 *
 *     [TODO] PATH: /thermometer/:id
 *            GET : read one thermometer
 *
 * ZONE
 *     PATH: /zone
 *     PUT: write zone to store
 *     GET : read zones
 *
 *     [TODO] PATH: /zone/:id
 *            GET : read one zone
 *
 * SYSTEM
 *     PATH: /system
 *     GET: read system status
 *
 * [NEXT]
 */
