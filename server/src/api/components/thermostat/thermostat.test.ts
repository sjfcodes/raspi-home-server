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

jest.mock('../zone/actions', () => ({
    onThermostatUpdate: jest.fn(),
}));

import { logger } from '../../../services/logger';
import { onThermostatUpdate } from '../zone/actions';
import {
    thermostatStore,
    getThermostats,
    getThermostatById,
    setThermostatById,
} from './store';
import { Thermostat } from '../../../../../types/main';
import { HEATER_OVERRIDE_STATUS } from '../../../../../constant/constant';
import { THERMOSTAT_ID, ZONE_ID, ITEM_TYPE } from '../../../config/globals';

beforeAll(() => {
    thermostatStore.setPath('/thermostat');
});

afterEach(() => {
    jest.clearAllMocks();
});

describe('getThermostats', () => {
    it('returns all thermostats', () => {
        const state = getThermostats();
        expect(state[ZONE_ID.HOME]).toBeDefined();
        expect(state[ZONE_ID.OFFICE]).toBeDefined();
    });
});

describe('getThermostatById', () => {
    it('returns thermostat when it exists', () => {
        const item = getThermostatById(ZONE_ID.HOME);
        expect(item?.thermostatId).toEqual(THERMOSTAT_ID.HOME);
    });

    it('returns undefined when not found', () => {
        const item = getThermostatById('nonexistent');
        expect(item).toBeUndefined();
    });
});

describe('setThermostatById', () => {
    describe('validation', () => {
        it('logs error and returns when id is empty', () => {
            setThermostatById('', {} as Thermostat);
            expect(logger.error).toHaveBeenCalledWith('"id" must be defined');
        });

        it('logs error and returns when payload is undefined', () => {
            setThermostatById(THERMOSTAT_ID.HOME, undefined as unknown as Thermostat);
            expect(logger.error).toHaveBeenCalledWith('payload must be defined');
        });

        it('logs error and returns when min is not a number', () => {
            setThermostatById(THERMOSTAT_ID.HOME, {
                min: '70' as unknown as number,
            } as Thermostat);
            expect(logger.error).toHaveBeenCalledWith('thermostat.min must be type number.');
        });

        it('logs error and returns when max is not a number', () => {
            setThermostatById(THERMOSTAT_ID.HOME, {
                max: '80' as unknown as number,
            } as Thermostat);
            expect(logger.error).toHaveBeenCalledWith('thermostat.max must be type number.');
        });

        it('logs error and returns when min > max', () => {
            setThermostatById(THERMOSTAT_ID.HOME, {
                min: 80,
                max: 70,
            } as Thermostat);
            expect(logger.error).toHaveBeenCalledWith(
                'thermostat.min & thermostat.max pair out of range.'
            );
        });

        it('logs error when heaterOverride status is invalid', () => {
            setThermostatById(THERMOSTAT_ID.HOME, {
                thermostatId: THERMOSTAT_ID.HOME,
                heaterOverride: {
                    status: 'INVALID' as HEATER_OVERRIDE_STATUS,
                    expireAt: new Date().toISOString(),
                },
            } as Thermostat);
            expect(logger.error).toHaveBeenCalledWith(
                'thermostat.heaterOverride.status is invalid'
            );
        });

        it('logs error when prevState does not exist', () => {
            setThermostatById('nonexistent-id', {
                thermostatId: 'nonexistent-id',
                min: 65,
            } as Thermostat);
            expect(logger.error).toHaveBeenCalledWith('"prevState" must be defined');
        });

        it('does not update store when validation fails', () => {
            const before = getThermostatById(ZONE_ID.HOME);
            setThermostatById('', {} as Thermostat);
            const after = getThermostatById(ZONE_ID.HOME);
            expect(after?.updatedAt).toEqual(before?.updatedAt);
        });
    });

    describe('state updates', () => {
        it('merges payload into existing state', () => {
            setThermostatById(ZONE_ID.HOME, {
                thermostatId: THERMOSTAT_ID.HOME,
                min: 62,
                max: 72,
            } as Thermostat);

            const item = getThermostatById(ZONE_ID.HOME);
            expect(item?.min).toEqual(62);
            expect(item?.max).toEqual(72);
        });

        it('preserves existing fields not in payload', () => {
            const before = getThermostatById(ZONE_ID.HOME);
            setThermostatById(ZONE_ID.HOME, {
                thermostatId: THERMOSTAT_ID.HOME,
                min: 63,
            } as Thermostat);

            const after = getThermostatById(ZONE_ID.HOME);
            expect(after?.unit).toEqual(before?.unit);
            expect(after?.zoneId).toEqual(before?.zoneId);
        });

        it('sets updatedAt timestamp', () => {
            const before = getThermostatById(ZONE_ID.HOME);
            setThermostatById(ZONE_ID.HOME, {
                thermostatId: THERMOSTAT_ID.HOME,
                min: 64,
            } as Thermostat);

            const after = getThermostatById(ZONE_ID.HOME);
            expect(after?.updatedAt).not.toEqual(before?.updatedAt);
        });

        it('accepts valid heaterOverride', () => {
            const expireAt = new Date(Date.now() + 60000).toISOString();
            setThermostatById(ZONE_ID.HOME, {
                thermostatId: THERMOSTAT_ID.HOME,
                heaterOverride: {
                    status: HEATER_OVERRIDE_STATUS.FORCE_ON,
                    expireAt,
                },
            } as Thermostat);

            const item = getThermostatById(ZONE_ID.HOME);
            expect(item?.heaterOverride?.status).toEqual(HEATER_OVERRIDE_STATUS.FORCE_ON);
        });
    });

    describe('side effects', () => {
        it('calls onThermostatUpdate with zoneId', () => {
            setThermostatById(ZONE_ID.HOME, {
                thermostatId: THERMOSTAT_ID.HOME,
                min: 65,
            } as Thermostat);

            expect(onThermostatUpdate).toHaveBeenCalledWith(ZONE_ID.HOME);
        });

        it('does not call onThermostatUpdate when prevState missing', () => {
            setThermostatById('nonexistent', {
                thermostatId: 'nonexistent',
                min: 65,
            } as Thermostat);

            expect(onThermostatUpdate).not.toHaveBeenCalled();
        });
    });
});
