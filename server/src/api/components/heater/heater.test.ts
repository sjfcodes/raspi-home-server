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

jest.mock('../../../services/logger', () => ({
    logger: mockLogger,
    logging: {
        debug: { thermostat: { compareZoneThermostatAndThermometer: false } },
        includeData: false,
        includeMethods: [],
        includeSsePublish: false,
        includeSseSubScribe: false,
        includeSseUnsubScribe: false,
    },
    formatSseLog: jest.fn(),
}));

jest.mock('../../../services/pi', () => ({
    writeHeaterLog: jest.fn(),
}));

import { Request, Response, NextFunction } from 'express';
import { readItems, writeItem } from './controller';
import { heaterStore } from './store';

beforeAll(() => {
    heaterStore.setPath('/heater');
});

afterEach(() => {
    jest.clearAllMocks();
});

function mockReq(overrides: Partial<Request> = {}): Request {
    return { query: {}, body: {}, on: jest.fn(), ...overrides } as unknown as Request;
}

function mockRes(): Response {
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
        writeHead: jest.fn(),
        write: jest.fn(),
        flush: jest.fn(),
    };
    return res as unknown as Response;
}

describe('heater controller', () => {
    describe('readItems', () => {
        it('returns JSON state when subscribe is not set', () => {
            const req = mockReq();
            const res = mockRes();
            const next = jest.fn();

            readItems(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'success',
                data: heaterStore.getState(),
            });
        });

        it('subscribes to SSE when subscribe=true', () => {
            const req = mockReq({ query: { subscribe: 'true' } } as Partial<Request>);
            const res = mockRes();
            const next = jest.fn();

            readItems(req, res, next);

            expect(res.writeHead).toHaveBeenCalledWith(200, {
                'Content-Type': 'text/event-stream',
                Connection: 'keep-alive',
                'Cache-Control': 'no-cache',
            });
            expect(res.write).toHaveBeenCalled();
            expect(res.flush).toHaveBeenCalled();
        });

        it('calls next on error', () => {
            const req = mockReq();
            const res = { status: jest.fn(() => { throw new Error('fail'); }) } as unknown as Response;
            const next = jest.fn();

            readItems(req, res, next);

            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    describe('writeItem', () => {
        it('sets heater and returns success', () => {
            const body = { chipId: 'test-heater', heaterPinVal: 1 };
            const req = mockReq({ body });
            const res = mockRes();
            const next = jest.fn();

            writeItem(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'success',
                data: {},
            });

            const stored = heaterStore.getState()['test-heater'];
            expect(stored?.heaterPinVal).toEqual(1);
        });

        it('calls next on error', () => {
            const req = mockReq({ body: null });
            const res = { status: jest.fn(() => { throw new Error('fail'); }) } as unknown as Response;
            const next = jest.fn();

            writeItem(req, res, next);

            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });
    });
});
