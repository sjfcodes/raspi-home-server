const loggerM = {
    debug: jest.fn(),
    log: jest.fn(),
    info: jest.fn(),
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
import { errorMessage, onThermostatUpdate, testExport } from './actions';
import { Heater, Remote, Thermostat, Zone } from '../../../../../types/main';
import {
    HEATER_ID,
    ITEM_TYPE,
    REMOTE_ID,
    THERMOSTAT_ID,
    ZONE_ID,
} from '../../../config/globals';
import { thermostatStore } from '../thermostat/store';
import { remoteStore } from '../remote/store';
import { heaterStore } from '../heater/store';
import { getWss } from '../heater/wss';

/**
 * @group ut/zone/actions
 */

afterEach(() => {
    jest.clearAllMocks();
});
describe('onThermostatUpdate', () => {
    // default zones are set so no test here
    // it('logs and returns when no zones', ()=>{})

    it('logs and returns when no zone)', () => {
        const mockCreateLogger = jest.spyOn(winston, 'createLogger');
        expect(mockCreateLogger).toHaveBeenCalled();

        onThermostatUpdate({} as Thermostat);
        expect(logger.debug).toHaveBeenCalledTimes(1);
        expect(logger.debug).toHaveBeenCalledWith(errorMessage.missingZone);
    });
});

describe('compareRemoteAndThermostat', () => {
    it('logs and return if no remote found', () => {
        testExport.compareRemoteAndThermostat({} as Zone);
        expect(logger.debug).toHaveBeenCalledTimes(1);
        expect(logger.debug).toHaveBeenCalledWith(errorMessage.missingRemote);
    });
    it('logs and return if no thermostat found', () => {
        testExport.compareRemoteAndThermostat({
            remoteId: REMOTE_ID.HOME,
        } as Zone);
        expect(logger.debug).toHaveBeenCalledTimes(1);
        expect(logger.debug).toHaveBeenCalledWith(
            errorMessage.missingThermostat
        );
    });

    it('turns heater off when thermostat temp greater then remote max', () => {
        // Arrange
        remoteStore.setPath('/remote');
        remoteStore.setState(REMOTE_ID.HOME, { max: 66 } as Remote);
        heaterStore.setPath('/heater');
        heaterStore.setState(HEATER_ID.HOME, {
            chipId: HEATER_ID.HOME,
            heaterPinVal: 1,
        } as Heater);
        thermostatStore.setPath('/thermostat');
        thermostatStore.setState(THERMOSTAT_ID.HOME, {
            tempF: 67,
        } as Thermostat);

        const zone: Zone = {
            zoneId: ZONE_ID.HOME,
            remoteId: REMOTE_ID.HOME,
            heaterId: HEATER_ID.HOME,
            thermostatId: THERMOSTAT_ID.HOME,
            zoneName: 'home',
            isActive: true,
            itemType: ITEM_TYPE.ZONE,
        };

        // Act
        testExport.compareRemoteAndThermostat(zone);

        // Assert
        const heater = heaterStore.getState()[HEATER_ID.HOME]
        expect(heater?.heaterPinVal).toEqual(0);
    });
    it('turns heater on when remote min less than thermostat temp', () => {
        // Arrange
        remoteStore.setPath('/remote');
        remoteStore.setState(REMOTE_ID.HOME, { min: 66 } as Remote);
        heaterStore.setPath('/heater');
        heaterStore.setState(HEATER_ID.HOME, {
            chipId: HEATER_ID.HOME,
            heaterPinVal: 0,
        } as Heater);
        thermostatStore.setPath('/thermostat');
        thermostatStore.setState(THERMOSTAT_ID.HOME, {
            tempF: 65,
        } as Thermostat);

        const zone: Zone = {
            zoneId: ZONE_ID.HOME,
            remoteId: REMOTE_ID.HOME,
            heaterId: HEATER_ID.HOME,
            thermostatId: THERMOSTAT_ID.HOME,
            zoneName: 'home',
            isActive: true,
            itemType: ITEM_TYPE.ZONE,
        };

        // Act
        testExport.compareRemoteAndThermostat(zone);

        // Assert
        const heater = heaterStore.getState()[HEATER_ID.HOME]
        expect(heater?.heaterPinVal).toEqual(1);
    });
});
