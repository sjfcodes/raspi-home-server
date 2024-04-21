/**
 * Zone consists of:
 *  1 remote
 *  1 heater
 *  1 thermometer
 *
 *  Zone is responsible of turning heater off/on.
 */

import { Remote, Thermometer, Zone } from '../../../../../types/main';
import {
    getHeaterById,
    setHeaterById,
    handleHeaterMessageOut,
} from '../heater/store';
import { getZoneById, getZones } from './store';
import { getRemoteById, setRemoteById } from '../remote/store';
import { getThermometerById } from '../thermometer/store';
import { logger, logging } from '../../../services/logger';
import { HEATER_OVERRIDE_STATUS } from '../../../../../constant/constant';
import { getDate } from '../../../services/utility';

const debug = logging.debug.remote.compareZoneRemoteAndThermometer;

export const errorMessage = {
    missingHeater: 'MISSING HEATER',
    missingRemote: 'MISSING REMOTE',
    missingThermometer: 'MISSING THERMOSTAT',
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

    compareZoneRemoteAndThermometer(zone);
}

export function onThermometerUpdate(thermometer: Thermometer) {
    const zones = getZones();
    if (!zones) {
        debug && logger.debug(errorMessage.missingZones);
        return;
    }

    // thermometer belongs to one zone, get first match
    const [zone] = Object.values(zones).filter(
        (zone) => zone?.thermometerId === thermometer.chipId
    );
    if (!zone) {
        debug && logger.debug(errorMessage.missingZone);
        return;
    }

    compareZoneRemoteAndThermometer(zone);
}

function compareZoneRemoteAndThermometer(zone: Zone) {
    const remote = getRemoteById(zone.remoteId);
    if (!remote) {
        debug && logger.debug(errorMessage.missingRemote);
        return;
    }

    const thermometer = getThermometerById(zone.thermometerId);
    if (!thermometer) {
        debug && logger.debug(errorMessage.missingThermometer);
        return;
    }

    const heater = getHeaterById(zone.heaterId);
    if (!heater) {
        debug && logger.debug(errorMessage.missingHeater);
        return;
    }

    const heaterIsOn = heater.heaterPinVal === 1;
    const heaterOverrideStatus = checkRemoteHeaterOverrideStatus(remote);
    const temperatureAboveMax = thermometer.tempF > remote.max;
    const temperatureBelowMin = thermometer.tempF < remote.min;

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
    compareZoneRemoteAndThermometer,
    turnHeaterOffById,
    turnHeaterOnById,
    checkHeaterOverrideStatus: checkRemoteHeaterOverrideStatus,
};
