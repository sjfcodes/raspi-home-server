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
    writeThermometerLog: jest.fn(),
}));

jest.mock('../zone/actions', () => ({
    onThermometerUpdate: jest.fn(),
}));

import { logger } from '../../../services/logger';
import { writeThermometerLog } from '../../../services/pi';
import { onThermometerUpdate } from '../zone/actions';
import { thermometerStore, setThermometer, getThermometers, getThermometerById } from './store';
import { Thermometer } from '../../../../../types/main';
import { ITEM_TYPE, THERMOMETER_ID } from '../../../config/globals';

beforeAll(() => {
    thermometerStore.setPath('/thermometer');
});

afterEach(() => {
    jest.clearAllMocks();
});

describe('setThermometer', () => {
    describe('validation', () => {
        it('logs error and returns when candidate is undefined', () => {
            const result = setThermometer(undefined as unknown as Thermometer);
            expect(result).toBeUndefined();
            expect(logger.error).toHaveBeenCalledWith(
                new Error('setThermometer: "candidate" must be defined')
            );
        });

        it('logs error and returns when chipId is missing', () => {
            const result = setThermometer({ tempF: 70 } as Thermometer);
            expect(result).toBeUndefined();
            expect(logger.error).toHaveBeenCalledWith(
                new Error('setThermometer: "chipId" must be defined')
            );
        });

        it('logs error and returns when tempF is not a number', () => {
            const result = setThermometer({
                chipId: 'test-chip',
                tempF: '70' as unknown as number,
            } as Thermometer);
            expect(result).toBeUndefined();
            expect(logger.error).toHaveBeenCalledWith(
                new Error('setThermometer: unexpected type for: "tempF"')
            );
        });

        it('does not update store on invalid input', () => {
            setThermometer(undefined as unknown as Thermometer);
            expect(thermometerStore.getState()).toEqual({});
        });
    });

    describe('state updates', () => {
        it('stores thermometer by chipId', () => {
            setThermometer({ chipId: 'chip-a', tempF: 70 } as Thermometer);

            const state = thermometerStore.getState();
            expect(state['chip-a']).toBeDefined();
            expect(state['chip-a']?.chipId).toEqual('chip-a');
        });

        it('sets itemType to THERMOMETER', () => {
            setThermometer({ chipId: 'chip-b', tempF: 72 } as Thermometer);

            const item = thermometerStore.getState()['chip-b'];
            expect(item?.itemType).toEqual(ITEM_TYPE.THERMOMETER);
        });

        it('sets updatedAt timestamp', () => {
            setThermometer({ chipId: 'chip-c', tempF: 68 } as Thermometer);

            const item = thermometerStore.getState()['chip-c'];
            expect(item?.updatedAt).toBeDefined();
        });

        it('truncates decimal temperatures', () => {
            setThermometer({ chipId: 'chip-d', tempF: 70.9 } as Thermometer);

            const item = thermometerStore.getState()['chip-d'];
            expect(item?.tempF).toEqual(70);
        });
    });

    describe('temperature averaging', () => {
        it('returns exact temp on first reading', () => {
            setThermometer({ chipId: 'avg-1', tempF: 72 } as Thermometer);

            const item = thermometerStore.getState()['avg-1'];
            expect(item?.tempF).toEqual(72);
        });

        it('averages multiple readings', () => {
            const chipId = 'avg-2';
            setThermometer({ chipId, tempF: 60 } as Thermometer);
            setThermometer({ chipId, tempF: 80 } as Thermometer);

            const item = thermometerStore.getState()[chipId];
            // avg of [60, 80] = 70
            expect(item?.tempF).toEqual(70);
        });

        it('caps history at 60 entries', () => {
            const chipId = 'avg-3';
            // fill 60 entries with 50
            for (let i = 0; i < 60; i++) {
                setThermometer({ chipId, tempF: 50 } as Thermometer);
            }
            expect(thermometerStore.getState()[chipId]?.tempF).toEqual(50);

            // push a 61st reading — oldest 50 gets shifted out, replaced by 110
            setThermometer({ chipId, tempF: 110 } as Thermometer);

            // avg = (59 * 50 + 110) / 60 = 3060/60 = 51
            expect(thermometerStore.getState()[chipId]?.tempF).toEqual(51);
        });

        it('maintains separate history per chipId', () => {
            setThermometer({ chipId: 'sep-a', tempF: 60 } as Thermometer);
            setThermometer({ chipId: 'sep-b', tempF: 80 } as Thermometer);

            expect(thermometerStore.getState()['sep-a']?.tempF).toEqual(60);
            expect(thermometerStore.getState()['sep-b']?.tempF).toEqual(80);
        });
    });

    describe('side effects', () => {
        it('calls onThermometerUpdate with new state', () => {
            setThermometer({ chipId: 'fx-1', tempF: 70 } as Thermometer);

            expect(onThermometerUpdate).toHaveBeenCalledWith(
                expect.objectContaining({ chipId: 'fx-1', tempF: 70 })
            );
        });

        it('writes log for HOME thermometer', () => {
            setThermometer({
                chipId: THERMOMETER_ID.HOME,
                tempF: 68,
            } as Thermometer);

            expect(writeThermometerLog).toHaveBeenCalledWith(
                expect.objectContaining({ chipId: THERMOMETER_ID.HOME })
            );
        });

        it('does not write log for non-HOME thermometer', () => {
            setThermometer({ chipId: 'other-chip', tempF: 68 } as Thermometer);

            expect(writeThermometerLog).not.toHaveBeenCalled();
        });
    });
});

describe('getThermometers', () => {
    it('returns all thermometers', () => {
        const state = getThermometers();
        expect(typeof state).toEqual('object');
    });
});

describe('getThermometerById', () => {
    it('returns thermometer when it exists', () => {
        setThermometer({ chipId: 'lookup-1', tempF: 65 } as Thermometer);

        const item = getThermometerById('lookup-1');
        expect(item?.chipId).toEqual('lookup-1');
    });

    it('returns undefined when not found', () => {
        const item = getThermometerById('nonexistent');
        expect(item).toBeUndefined();
    });
});
