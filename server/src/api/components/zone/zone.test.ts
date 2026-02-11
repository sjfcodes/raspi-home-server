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
        debug: { thermostat: { compareZoneThermostatAndThermometer: true } },
        includeData: false,
        includeMethods: [],
        includeSsePublish: false,
        includeSseSubScribe: false,
        includeSseUnsubScribe: false,
    },
    formatSseLog: jest.fn(),
}));

import { logger } from '../../../services/logger';
import {
    zoneStore,
    getZones,
    getZoneById,
    setZone,
} from './store';
import {
    onThermometerUpdate,
    onThermostatUpdate,
    errorMessage,
    statusMessage,
    testExport,
} from './actions';
import { thermometerStore } from '../thermometer/store';
import { thermostatStore } from '../thermostat/store';
import { heaterStore } from '../heater/store';
import { Zone, Thermometer, Thermostat, Heater } from '../../../../../types/main';
import {
    ZONE_ID,
    THERMOSTAT_ID,
    THERMOMETER_ID,
    HEATER_ID,
    ITEM_TYPE,
} from '../../../config/globals';

beforeAll(() => {
    zoneStore.setPath('/zone');
    heaterStore.setPath('/heater');
    thermostatStore.setPath('/thermostat');
    thermometerStore.setPath('/thermometer');
});

afterEach(() => {
    jest.clearAllMocks();
});

describe('zone store', () => {
    describe('getZones', () => {
        it('returns all zones', () => {
            const zones = getZones();
            expect(zones[ZONE_ID.HOME]).toBeDefined();
            expect(zones[ZONE_ID.OFFICE]).toBeDefined();
        });

        it('returns a clone (not a reference)', () => {
            const a = getZones();
            const b = getZones();
            expect(a).toEqual(b);
            expect(a).not.toBe(b);
        });
    });

    describe('getZoneById', () => {
        it('returns zone when it exists', () => {
            const zone = getZoneById(ZONE_ID.HOME);
            expect(zone?.zoneName).toEqual('home');
        });

        it('returns undefined when not found', () => {
            expect(getZoneById('nonexistent')).toBeUndefined();
        });
    });

    describe('setZone', () => {
        it('stores a zone by zoneId', () => {
            const zone: Zone = {
                zoneId: 'test-zone',
                zoneName: 'test',
                thermostatId: 'ts-1',
                thermometerId: 'tm-1',
                heaterId: 'h-1',
                isActive: true,
                itemType: ITEM_TYPE.ZONE,
            };
            setZone(zone);

            const stored = getZoneById('test-zone');
            expect(stored?.zoneName).toEqual('test');
        });

        it('overwrites existing zone', () => {
            const updated: Zone = {
                zoneId: ZONE_ID.HOME,
                zoneName: 'home-updated',
                thermostatId: THERMOSTAT_ID.HOME,
                thermometerId: THERMOMETER_ID.HOME,
                heaterId: HEATER_ID.HOME,
                isActive: false,
                itemType: ITEM_TYPE.ZONE,
            };
            setZone(updated);

            const stored = getZoneById(ZONE_ID.HOME);
            expect(stored?.zoneName).toEqual('home-updated');
            expect(stored?.isActive).toEqual(false);

            // restore
            setZone({ ...updated, zoneName: 'home', isActive: true });
        });
    });
});

describe('onThermometerUpdate', () => {
    it('logs missing zone when thermometer has no matching zone', () => {
        onThermometerUpdate({ chipId: 'unknown-chip' } as Thermometer);
        expect(logger.debug).toHaveBeenCalledWith(errorMessage.missingZone);
    });

    it('triggers compare when thermometer matches a zone', () => {
        // set up full zone state so compare runs through
        thermostatStore.setState(THERMOSTAT_ID.HOME, {
            thermostatId: THERMOSTAT_ID.HOME,
            min: 65,
            max: 75,
        } as Thermostat);
        heaterStore.setState(HEATER_ID.HOME, {
            chipId: HEATER_ID.HOME,
            heaterPinVal: 0,
        } as Heater);

        // restore home zone mapping
        // @ts-expect-error partial item
        zoneStore.setState(ZONE_ID.HOME, {
            zoneId: ZONE_ID.HOME,
            thermostatId: THERMOSTAT_ID.HOME,
            thermometerId: THERMOMETER_ID.HOME,
            heaterId: HEATER_ID.HOME,
        });

        thermometerStore.setState(THERMOMETER_ID.HOME, {
            chipId: THERMOMETER_ID.HOME,
            tempF: 70,
        } as Thermometer);

        onThermometerUpdate({
            chipId: THERMOMETER_ID.HOME,
            tempF: 70,
        } as Thermometer);

        // temp 70 is between min 65 and max 75, heater is off -> no update
        expect(logger.debug).toHaveBeenCalledWith(statusMessage.noUpdate);
    });
});

describe('onThermostatUpdate', () => {
    it('returns silently when zone not found', () => {
        onThermostatUpdate('nonexistent-zone');
        // should not throw, and no debug log for missing zone in this path
        expect(logger.debug).not.toHaveBeenCalled();
    });

    it('triggers compare for valid zone', () => {
        thermostatStore.setState(THERMOSTAT_ID.HOME, {
            thermostatId: THERMOSTAT_ID.HOME,
            min: 65,
            max: 75,
        } as Thermostat);
        heaterStore.setState(HEATER_ID.HOME, {
            chipId: HEATER_ID.HOME,
            heaterPinVal: 0,
        } as Heater);
        thermometerStore.setState(THERMOMETER_ID.HOME, {
            chipId: THERMOMETER_ID.HOME,
            tempF: 70,
        } as Thermometer);

        // @ts-expect-error partial item
        zoneStore.setState(ZONE_ID.HOME, {
            zoneId: ZONE_ID.HOME,
            thermostatId: THERMOSTAT_ID.HOME,
            thermometerId: THERMOMETER_ID.HOME,
            heaterId: HEATER_ID.HOME,
        });

        onThermostatUpdate(ZONE_ID.HOME);
        expect(logger.debug).toHaveBeenCalledWith(statusMessage.noUpdate);
    });
});

describe('compareZoneThermostatAndThermometer edge cases', () => {
    it('does not turn heater off when temp equals max + 1 (hysteresis boundary)', () => {
        thermostatStore.setState(THERMOSTAT_ID.HOME, { max: 70 } as Thermostat);
        heaterStore.setState(HEATER_ID.HOME, {
            chipId: HEATER_ID.HOME,
            heaterPinVal: 1,
        } as Heater);
        thermometerStore.setState(THERMOMETER_ID.HOME, {
            tempF: 71, // equals max + 1, not greater
        } as Thermometer);

        // @ts-expect-error partial item
        zoneStore.setState(ZONE_ID.HOME, {
            zoneId: ZONE_ID.HOME,
            thermostatId: THERMOSTAT_ID.HOME,
            thermometerId: THERMOMETER_ID.HOME,
            heaterId: HEATER_ID.HOME,
        });

        testExport.compareZoneThermostatAndThermometer({
            zoneId: ZONE_ID.HOME,
            thermostatId: THERMOSTAT_ID.HOME,
            thermometerId: THERMOMETER_ID.HOME,
            heaterId: HEATER_ID.HOME,
        } as Zone);

        const heater = heaterStore.getState()[HEATER_ID.HOME];
        expect(heater?.heaterPinVal).toEqual(1); // stays on
    });

    it('does not turn heater on when temp equals min (boundary)', () => {
        thermostatStore.setState(THERMOSTAT_ID.HOME, { min: 65 } as Thermostat);
        heaterStore.setState(HEATER_ID.HOME, {
            chipId: HEATER_ID.HOME,
            heaterPinVal: 0,
        } as Heater);
        thermometerStore.setState(THERMOMETER_ID.HOME, {
            tempF: 65, // equals min, not less than
        } as Thermometer);

        testExport.compareZoneThermostatAndThermometer({
            zoneId: ZONE_ID.HOME,
            thermostatId: THERMOSTAT_ID.HOME,
            thermometerId: THERMOMETER_ID.HOME,
            heaterId: HEATER_ID.HOME,
        } as Zone);

        const heater = heaterStore.getState()[HEATER_ID.HOME];
        expect(heater?.heaterPinVal).toEqual(0); // stays off
    });
});
