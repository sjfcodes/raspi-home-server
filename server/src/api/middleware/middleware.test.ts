/**
 * @group ut
 */

const mockLogger = {
    debug: jest.fn(),
    info: jest.fn(),
    error: jest.fn(),
    add: jest.fn(),
    exceptions: { handle: jest.fn() },
};

jest.mock('../../services/logger', () => ({
    logger: mockLogger,
    logging: {
        includeData: true,
        includeMethods: ['GET', 'POST', 'PUT'],
        includeSsePublish: false,
        includeSseSubScribe: false,
        includeSseUnsubScribe: false,
        debug: { thermostat: { compareZoneThermostatAndThermometer: false } },
    },
    formatSseLog: jest.fn(),
}));

import { Request, Response, NextFunction } from 'express';
import { logger, logging } from '../../services/logger';
import { routeLogger } from './index';

afterEach(() => {
    jest.clearAllMocks();
});

function mockReq(overrides: Partial<Request> = {}): Request {
    return { method: 'GET', path: '/', body: {}, ...overrides } as Request;
}

function mockRes(): Response {
    return {} as Response;
}

describe('routeLogger', () => {
    it('logs GET requests with method and path', () => {
        const next = jest.fn();
        routeLogger(mockReq({ method: 'GET', path: '/api/v1/heater' }), mockRes(), next);

        expect(logger.info).toHaveBeenCalledWith('GET /api/v1/heater {}');
        expect(next).toHaveBeenCalled();
    });

    it('logs POST requests with body data', () => {
        const next = jest.fn();
        const body = { chipId: 'abc', tempF: 70 };
        routeLogger(
            mockReq({ method: 'POST', path: '/api/v1/thermometer', body }),
            mockRes(),
            next,
        );

        expect(logger.info).toHaveBeenCalledWith(
            `POST /api/v1/thermometer ${JSON.stringify(body)}`
        );
        expect(next).toHaveBeenCalled();
    });

    it('logs PUT requests', () => {
        const next = jest.fn();
        routeLogger(mockReq({ method: 'PUT', path: '/api/v1/thermostat' }), mockRes(), next);

        expect(logger.info).toHaveBeenCalledWith('PUT /api/v1/thermostat {}');
        expect(next).toHaveBeenCalled();
    });

    it('does not log excluded methods (DELETE)', () => {
        const next = jest.fn();
        routeLogger(mockReq({ method: 'DELETE', path: '/api/v1/zone' }), mockRes(), next);

        expect(logger.info).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalled();
    });

    it('does not log excluded methods (PATCH)', () => {
        const next = jest.fn();
        routeLogger(mockReq({ method: 'PATCH', path: '/something' }), mockRes(), next);

        expect(logger.info).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalled();
    });

    it('logs string body as-is when not an object', () => {
        const next = jest.fn();
        routeLogger(
            mockReq({ method: 'POST', path: '/test', body: 'raw-string' }),
            mockRes(),
            next,
        );

        expect(logger.info).toHaveBeenCalledWith('POST /test raw-string');
    });

    it('always calls next()', () => {
        const next = jest.fn();
        routeLogger(mockReq(), mockRes(), next);
        expect(next).toHaveBeenCalledTimes(1);
    });
});
