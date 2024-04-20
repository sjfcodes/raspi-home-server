/**
 * Zone consists of:
 *  1 remote
 *  1 heater
 *  1 thermostat
 *
 *  Zone is responsible of turning heater off/on.
 */

import { Remote, Thermostat, Zone } from '../../../../../types/main';
import {
    getHeaterById,
    setHeaterById,
    handleHeaterMessageOut,
} from '../heater/store';
import { getZoneById, getZones } from './store';
import { getRemoteById, setRemoteById } from '../remote/store';
import { getThermostatById } from '../thermostat/store';
import { logger, logging } from '../../../services/logger';
import { HEATER_OVERRIDE_STATUS } from '../../../../../constant/constant';
import { getDate } from '../../../services/utility';

const debug = logging.debug.remote.compareZoneRemoteAndThermostat;

export const errorMessage = {
    missingHeater: 'MISSING HEATER',
    missingRemote: 'MISSING REMOTE',
    missingThermostat: 'MISSING THERMOSTAT',
    missingZone: 'MISSING ZONE',
    missingZones: 'MISSING ZONES',
};

export const statusMessage = {
    heaterOff: 'HEATER OFF',
    heaterOn: 'HEATER ON',
    noUpdate: 'NO UPDATE',
};

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

    const heater = getHeaterById(zone.heaterId);
    if (!heater) {
        debug && logger.debug(errorMessage.missingHeater);
        return;
    }

    const heaterIsOn = heater.heaterPinVal === 1;
    const heaterOverrideStatus = checkRemoteHeaterOverrideStatus(remote);
    const temperatureAboveMax = thermostat.tempF > remote.max;
    const temperatureBelowMin = thermostat.tempF < remote.min;

    // Check for active overrides
    if (heaterOverrideStatus === HEATER_OVERRIDE_STATUS.FORCE_OFF) {
        turnHeaterOffById(heater.chipId);
        debug && logger.debug(statusMessage.heaterOff);
        return;
    }
    if (heaterOverrideStatus === HEATER_OVERRIDE_STATUS.FORCE_ON) {
        turnHeaterOnById(heater.chipId);
        debug && logger.debug(statusMessage.heaterOn);
        return;
    }

    // Check for respond to temp change
    if (heaterIsOn && temperatureAboveMax) {
        turnHeaterOffById(heater.chipId);
        debug && logger.debug(statusMessage.heaterOff);
        return;
    }
    if (!heaterIsOn && temperatureBelowMin) {
        turnHeaterOnById(heater.chipId);
        debug && logger.debug(statusMessage.heaterOn);
        return;
    }

    debug && logger.debug(statusMessage.noUpdate);
}

function turnHeaterOffById(heaterId: string) {
    const heaterPinVal = 0;
    setHeaterById(heaterId, { heaterPinVal });
    handleHeaterMessageOut(heaterPinVal);
}

function turnHeaterOnById(heaterId: string) {
    const heaterPinVal = 1;
    setHeaterById(heaterId, { heaterPinVal });
    handleHeaterMessageOut(heaterPinVal);
}

function checkRemoteHeaterOverrideStatus(remote: Remote) {
    // If missing requirements, return
    if (!remote?.heaterOverride?.status) return;

    // If heater has expired override, delete override;
    if (remote.heaterOverride.expireAt < getDate()) {
        setRemoteById(remote.remoteId, { heaterOverride: undefined } as Remote);
        return;
    }

    // return override status
    return remote.heaterOverride.status;
}

export const testExport = {
    compareZoneRemoteAndThermostat,
    turnHeaterOffById,
    turnHeaterOnById,
    checkHeaterOverrideStatus: checkRemoteHeaterOverrideStatus,
};
