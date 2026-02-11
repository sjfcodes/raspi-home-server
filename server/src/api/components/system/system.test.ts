/**
 * @group ut
 */

import { readFileSync } from 'fs';

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

jest.mock('fs', () => ({
    existsSync: jest.fn().mockReturnValue(true),
    mkdirSync: jest.fn(),
    readFileSync: jest.fn(),
}));

// Prevent the setInterval side effect from interfering
jest.useFakeTimers();

import { logger } from '../../../services/logger';
import { systemStore, getPiCpuInfo, getPiTemp } from './store';

const mockReadFileSync = readFileSync as jest.MockedFunction<typeof readFileSync>;

beforeAll(() => {
    systemStore.setPath('/system/temperature');
});

afterEach(() => {
    jest.clearAllMocks();
});

const fakeCpuInfo = [
    'processor\t: 0',
    'BogoMIPS\t: 108.00',
    'Features\t: fp asimd',
    'CPU implementer\t: 0x41',
    'CPU architecture\t: 8',
    'CPU variant\t: 0x0',
    'CPU part\t: 0xd08',
    'CPU revision\t: 3',
    '',
    'Revision\t: d03114',
    'Serial\t: 100000001234abcd',
    'Model\t: Raspberry Pi 4 Model B Rev 1.4',
].join('\n');

describe('getPiCpuInfo', () => {
    it('parses /proc/cpuinfo into structured object', async () => {
        mockReadFileSync.mockReturnValueOnce(fakeCpuInfo);

        const info = await getPiCpuInfo();

        expect(info?.processor).toEqual('0');
        expect(info?.BogoMIPS).toEqual('108.00');
        expect(info?.Serial).toEqual('100000001234abcd');
        expect(info?.Model).toEqual('Raspberry Pi 4 Model B Rev 1.4');
        expect(info?.readAt).toBeDefined();
    });

    it('caches result after first call', async () => {
        const first = await getPiCpuInfo();
        const second = await getPiCpuInfo();

        expect(first).toEqual(second);
    });
});

describe('getPiTemp', () => {
    it('reads thermal zone and returns temperature', async () => {
        mockReadFileSync.mockReturnValue('42000' as any);

        const temp = await getPiTemp();

        expect(temp?.tempC).toEqual(42);
        expect(temp?.tempF).toEqual(107);
        expect(temp?.readAt).toBeDefined();
        expect(temp?.id).toEqual('100000001234abcd');
    });

    it('logs error when temp is NaN', async () => {
        mockReadFileSync.mockReturnValue('not-a-number' as any);

        const temp = await getPiTemp();

        expect(temp).toBeUndefined();
        expect(logger.error).toHaveBeenCalledWith('temp must be number');
    });
});
