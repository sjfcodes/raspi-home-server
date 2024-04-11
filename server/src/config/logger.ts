import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { createLogger, format, transports } from 'winston';
import { NextFunction, Request, Response } from 'express';

import { env } from './globals';

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
    // [NOTE]: writes to files triggers server restsart in dev mode
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
