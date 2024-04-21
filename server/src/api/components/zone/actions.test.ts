/**
 * @group ut
 */

const loggerM = {
    debug: jest.fn(),
    log: jest.fn(console.log),
    info: jest.fn(console.info),
    error: jest.fn(console.error),
    add: jest.fn(),
    exceptions: {
        handle: jest.fn(),
    },
};

// trying to mock createLogger to return a specific loggerM instance
jest.mock('winston', () => ({
    format: {
        colorize: jest.fn(),
        combine: jest.fn(),
        label: jest.fn(),
        simple: jest.fn(),
        timestamp: jest.fn(),
        printf: jest.fn(),
    },
    createLogger: jest.fn().mockReturnValue(loggerM),
    transports: {
        Console: jest.fn(),
    },
}));

import * as winston from 'winston';
import { logger } from '../../../services/logger';
import { errorMessage, testExport } from './actions';
import { Heater, Thermostat, Thermometer, Zone } from '../../../../../types/main';
import {
    HEATER_ID,
    ITEM_TYPE,
    THERMOSTAT_ID,
    THERMOMETER_ID,
    ZONE_ID,
} from '../../../config/globals';
import { thermometerStore } from '../thermometer/store';
import { thermostatStore } from '../thermostat/store';
import { heaterStore } from '../heater/store';
import { HEATER_OVERRIDE_STATUS } from '../../../../../constant/constant';
import { zoneStore } from './store';

beforeAll(() => {
    zoneStore.setPath('/zone');
    heaterStore.setPath('/heater');
    thermostatStore.setPath('/thermostat');
    thermometerStore.setPath('/thermometer');
});

afterEach(() => {
    jest.clearAllMocks();
});

// describe('onThermometerUpdate', () => {
//     // default zones are set so no test here
//     // it('logs and returns when no zones', ()=>{})

//     it('logs and returns when no zone)', () => {
//         const mockCreateLogger = jest.spyOn(winston, 'createLogger');
//         expect(mockCreateLogger).toHaveBeenCalled();

//         onThermometerUpdate({} as Thermometer);
//         expect(logger.debug).toHaveBeenCalledTimes(1);
//         expect(logger.debug).toHaveBeenCalledWith(errorMessage.missingZone);
//     });
// });

describe('checkThermostatHeaterOverrideStatus', () => {
    it.skip('logs and return if no thermostat found', () => {
        testExport.compareZoneThermostatAndThermometer({} as Zone);
        expect(logger.debug).toHaveBeenCalledTimes(1);
        expect(logger.debug).toHaveBeenCalledWith(errorMessage.missingThermostat);
    });

    it.skip('logs and return if no thermometer found', () => {
        testExport.compareZoneThermostatAndThermometer({
            thermostatId: THERMOSTAT_ID.HOME,
        } as Zone);
        expect(logger.debug).toHaveBeenCalledTimes(1);
        expect(logger.debug).toHaveBeenCalledWith(
            errorMessage.missingThermometer
        );
    });

    it.skip('log and return if no heater found', () => {
        const thermometer = {
            chipId: THERMOMETER_ID.HOME,
        } as Thermometer;
        thermometerStore.setState(THERMOMETER_ID.HOME, thermometer);
        testExport.compareZoneThermostatAndThermometer({
            thermostatId: THERMOSTAT_ID.HOME,
            thermometerId: THERMOMETER_ID.HOME,
        } as Zone);
        expect(logger.debug).toHaveBeenCalledTimes(1);
        expect(logger.debug).toHaveBeenCalledWith(errorMessage.missingHeater);
    });

    it('turns heater off when thermometer temp greater then thermostat max', () => {
        // Arrange
        thermostatStore.setState(THERMOSTAT_ID.HOME, { max: 66 } as Thermostat);
        heaterStore.setState(HEATER_ID.HOME, {
            chipId: HEATER_ID.HOME,
            heaterPinVal: 1,
        } as Heater);
        thermometerStore.setState(THERMOMETER_ID.HOME, {
            tempF: 67,
        } as Thermometer);

        const zone: Zone = {
            zoneId: ZONE_ID.HOME,
            thermostatId: THERMOSTAT_ID.HOME,
            heaterId: HEATER_ID.HOME,
            thermometerId: THERMOMETER_ID.HOME,
            zoneName: 'home',
            isActive: true,
            itemType: ITEM_TYPE.ZONE,
        };

        // Act
        testExport.compareZoneThermostatAndThermometer(zone);

        // Assert
        const heater = heaterStore.getState()[HEATER_ID.HOME];
        expect(heater?.heaterPinVal).toEqual(0);
    });

    it('turns heater on when thermostat min less than thermometer temp', () => {
        // Arrange
        thermostatStore.setState(THERMOSTAT_ID.HOME, { min: 66 } as Thermostat);
        heaterStore.setState(HEATER_ID.HOME, {
            chipId: HEATER_ID.HOME,
            heaterPinVal: 0,
        } as Heater);
        thermometerStore.setState(THERMOMETER_ID.HOME, {
            tempF: 65,
        } as Thermometer);

        const zone = {
            zoneId: ZONE_ID.HOME,
            thermostatId: THERMOSTAT_ID.HOME,
            heaterId: HEATER_ID.HOME,
            thermometerId: THERMOMETER_ID.HOME,
        } as Zone;

        // Act
        testExport.compareZoneThermostatAndThermometer(zone);

        // Assert
        const heater = heaterStore.getState()[HEATER_ID.HOME];
        expect(heater?.heaterPinVal).toEqual(1);
    });
});

describe('checkHeaterOverrideStatus', () => {
    it('returns undefined when no override set', () => {
        expect(
            testExport.checkHeaterOverrideStatus({} as Thermostat)
        ).toBeUndefined();
    });

    it('returns undefined when status expired', () => {
        const expireAt = new Date(Date.now() - 5000).toISOString();
        // @ts-expect-error partial item
        zoneStore.setState(ZONE_ID.HOME, {
            heaterId: HEATER_ID.HOME,
            thermostatId: THERMOSTAT_ID.HOME,
        });
        // @ts-expect-error partial item
        thermostatStore.setState(THERMOSTAT_ID.HOME, {
            thermostatId: HEATER_ID.HOME,
            heaterOverride: {
                expireAt,
                status: HEATER_OVERRIDE_STATUS.FORCE_ON,
            },
        });

        const beforeState = thermostatStore.getState()[THERMOSTAT_ID.HOME] as Thermostat;

        expect(beforeState?.heaterOverride?.expireAt).toEqual(expireAt);
        expect(
            testExport.checkHeaterOverrideStatus(beforeState)
        ).toBeUndefined();
    });

    it('returns status when status not expired', () => {
        const expireAt = new Date(Date.now() + 5000).toISOString();
        // @ts-expect-error partial item
        zoneStore.setState(ZONE_ID.HOME, {
            heaterId: HEATER_ID.HOME,
            thermostatId: THERMOSTAT_ID.HOME,
        });
        // @ts-expect-error partial item
        thermostatStore.setState(THERMOSTAT_ID.HOME, {
            thermostatId: HEATER_ID.HOME,
            heaterOverride: {
                expireAt,
                status: HEATER_OVERRIDE_STATUS.FORCE_ON,
            },
        });
        const beforeState = thermostatStore.getState()[THERMOSTAT_ID.HOME] as Thermostat;

        expect(beforeState?.heaterOverride?.expireAt).toEqual(expireAt);
        expect(
            testExport.checkHeaterOverrideStatus(beforeState)
        ).toEqual(HEATER_OVERRIDE_STATUS.FORCE_ON);
    });
});
