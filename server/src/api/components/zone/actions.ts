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
import { logger } from '../../../config/logger';

const debug = true;

export function onRemoteUpdate(zoneId: string) {
    const zone = getZoneById(zoneId);
    if (!zone) return;

    compareRemoteAndThermostat(zone);
}

export function onThermostatUpdate(thermostat: Thermostat) {
    const zones = getZones();
    if (!zones) {
        debug && logger.debug(`MISSING ZONES ${JSON.stringify(thermostat)}`);
        return;
    }

    // thermostat belongs to one zone, get first match
    const [zone] = Object.values(zones).filter(
        (zone) => zone?.thermostatId === thermostat.chipId
    );
    if (!zone) {
        debug && logger.debug(`MISSING ZONE ${JSON.stringify(thermostat)}`);
        return;
    }

    compareRemoteAndThermostat(zone);
}

function compareRemoteAndThermostat(zone: Zone) {
    const remote = getRemoteById(zone.remoteId);
    if (!remote) {
        debug && logger.debug(`MISSING REMOTE ${JSON.stringify(zone)}`);
        return;
    }

    const thermostat = getThermostatById(zone.thermostatId);
    if (!thermostat) {
        debug && logger.debug(`MISSING THERMOSTAT ${JSON.stringify(zone)}`);
        return;
    }

    // When thermostat's temperature is greater then remote's max,
    if (thermostat.tempF > remote.max) {
        // then turn heater off.
        turnHeaterOff(zone.heaterId);
        debug && logger.debug(`HEATER OFF ${JSON.stringify(zone)}`);
        return;
    }

    // When thermostat's temperature is less then remote's min,
    if (thermostat.tempF < remote.min) {
        // then turn heater on.
        turnHeaterOn(zone.heaterId);
        debug && logger.debug(`HEATER ON ${JSON.stringify(zone)}`);
        return;
    }
    debug && logger.debug(`NO UPDATE ${JSON.stringify(zone)}`);
}

function turnHeaterOff(heaterId: string) {
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
