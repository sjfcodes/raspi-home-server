import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { createLogger, format, transports } from 'winston';

import { env } from '../config/globals';

export const logging = {
    includeData: true,
    includeMethods: [
        'GET',
        'POST',
        'PUT',
    ],
    includeSsePublish: !true,
    includeSseSubScribe: !true,
    includeSseUnsubScribe: !true,
    debug: {
        thermostat: {
            compareZoneThermostatAndThermometer: false,
        }
    }
};

const logDir = 'logs';

// Create the log directory if it does not exist
if (!existsSync(logDir)) {
    mkdirSync(logDir);
}

const errorLog = join(logDir, 'error.log');
const combinedLog = join(logDir, 'combined.log');
const exceptionsLog = join(logDir, 'exceptions.log');

export const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
        }),
        format.printf(
            (info) => `${info.timestamp} ${info.level}: ${info.message}`
        )
    ),
    // transports: [
    //     new transports.File({
    //         filename: errorLog,
    //         level: 'error',
    //     }),
    //     new transports.File({
    //         filename: combinedLog,
    //     }),
    // ],
    // exceptionHandlers: [
    //     new transports.File({
    //         filename: exceptionsLog,
    //         handleExceptions: false,
    //     }),
    // ],
});

if (env.NODE_ENV !== 'production') {
    logger.add(
        new transports.Console({
            level: 'debug',
            format: format.combine(
                format.colorize(),
                format.printf(
                    (info) => `${info.timestamp} ${info.level}: ${info.message}`
                )
            ),
        })
    );

    // log errors to console
    logger.exceptions.handle(
        new transports.Console({
            format: format.simple(),
        })
    );
}

export function formatSseLog(
    path: string,
    message: string,
    data: any = {}
): string {
    const args = [path, message];
    if (logging.includeData) args.push(JSON.stringify(data));
    return args.join(' ');
}
