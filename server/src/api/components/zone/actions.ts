/**
 * Zone consists of:
 *  1 remote
 *  1 heater
 *  1 thermostat
 *
 *  Zone is responsible of turning heater off/on.
 */

import { Thermostat, Zone } from '../../../../../types/main';
import {
    getHeaterById,
    setHeaterById,
    handleMessageOut,
} from '../heater/store';
import { getZoneById, getZones } from './store';
import { getRemoteById } from '../remote/store';
import { getThermostatById } from '../thermostat/store';
import { logger } from '../../../services/logger';

const debug = true;

export enum errorMessage {
    missingZones = 'MISSING ZONES',
    missingZone = 'MISSING ZONE',
    missingRemote = 'MISSING REMOTE',
    missingThermostat = 'MISSING THERMOSTAT',
}

export enum statusMessage {
    heaterOff = 'HEATER OFF',
    heaterOn = 'HEATER ON',
    noUpdate = 'NO UPDATE',
}

export function onRemoteUpdate(zoneId: string) {
    const zone = getZoneById(zoneId);
    if (!zone) return;

    compareZoneRemoteAndThermostat(zone);
}

export function onThermostatUpdate(thermostat: Thermostat) {
    const zones = getZones();
    if (!zones) {
        debug && logger.debug(errorMessage.missingZones);
        return;
    }

    // thermostat belongs to one zone, get first match
    const [zone] = Object.values(zones).filter(
        (zone) => zone?.thermostatId === thermostat.chipId
    );
    if (!zone) {
        debug && logger.debug(errorMessage.missingZone);
        return;
    }

    compareZoneRemoteAndThermostat(zone);
}

export enum compareRemoteAndThermostatError {

}

function compareZoneRemoteAndThermostat(zone: Zone) {
    const remote = getRemoteById(zone.remoteId);
    if (!remote) {
        debug && logger.debug(errorMessage.missingRemote);
        return;
    }

    const thermostat = getThermostatById(zone.thermostatId);
    if (!thermostat) {
        debug && logger.debug(errorMessage.missingThermostat);
        return;
    }

    // When thermostat's temperature is greater then remote's max,
    if (thermostat.tempF > remote.max) {
        // then turn heater off.
        turnHeaterOff(zone.heaterId);
        debug && logger.debug(statusMessage.heaterOff);
        return;
    }

    // When thermostat's temperature is less then remote's min,
    if (thermostat.tempF < remote.min) {
        // then turn heater on.
        turnHeaterOn(zone.heaterId);
        debug && logger.debug(statusMessage.heaterOn);
        return;
    }
    debug && logger.debug(statusMessage.noUpdate);
}

function turnHeaterOff(heaterId: string) {
    console.log(heaterId)
    const heater = getHeaterById(heaterId);
    if (!heater || heater.heaterPinVal === 0) return;

    const heaterPinVal = 0;
    setHeaterById({ ...heater, heaterPinVal });
    handleMessageOut(heaterPinVal);
}

function turnHeaterOn(heaterId: string) {
    const heater = getHeaterById(heaterId);
    if (!heater || heater.heaterPinVal === 1) return;

    const heaterPinVal = 1;
    setHeaterById({ ...heater, heaterPinVal });
    handleMessageOut(heaterPinVal);
}

export const testExport = { compareRemoteAndThermostat: compareZoneRemoteAndThermostat, turnHeaterOff, turnHeaterOn }