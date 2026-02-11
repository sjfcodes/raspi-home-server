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

jest.mock('./logger', () => ({
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

import { logger } from './logger';
import {
    handleError,
    hashPassword,
    verifyPassword,
    hashString,
    generateUuid,
    getDate,
} from './utility';

afterEach(() => {
    jest.clearAllMocks();
});

describe('handleError', () => {
    it('logs error stack when available', () => {
        const err = new Error('test error');
        handleError(err);
        expect(logger.error).toHaveBeenCalledWith(err.stack);
    });

    it('logs error directly when no stack', () => {
        handleError('plain string error');
        expect(logger.error).toHaveBeenCalledWith('plain string error');
    });
});

describe('hashPassword / verifyPassword', () => {
    it('hashes a password and verifies it', async () => {
        const plain = 'my-secret-password';
        const hashed = await hashPassword(plain);

        expect(hashed).not.toEqual(plain);
        expect(typeof hashed).toEqual('string');

        const match = await verifyPassword(plain, hashed);
        expect(match).toBe(true);
    });

    it('rejects wrong password', async () => {
        const hashed = await hashPassword('correct-password');
        const match = await verifyPassword('wrong-password', hashed);
        expect(match).toBe(false);
    });
});

describe('hashString', () => {
    it('returns a sha256 hex string', () => {
        const result = hashString('hello');
        expect(result).toEqual(
            '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824'
        );
    });

    it('returns consistent hash for same input', () => {
        expect(hashString('test')).toEqual(hashString('test'));
    });

    it('returns different hash for different input', () => {
        expect(hashString('a')).not.toEqual(hashString('b'));
    });
});

describe('generateUuid', () => {
    it('returns a string in uuid format', () => {
        const uuid = generateUuid();
        expect(uuid).toMatch(
            /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
        );
    });

    it('returns unique values', () => {
        const a = generateUuid();
        const b = generateUuid();
        expect(a).not.toEqual(b);
    });
});

describe('getDate', () => {
    it('returns an ISO date string', () => {
        const date = getDate();
        expect(new Date(date).toISOString()).toEqual(date);
    });
});
