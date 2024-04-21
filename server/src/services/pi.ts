import fs from 'fs';
import { Heater, Thermometer } from '../../../types/main';
import { isTestEnv } from '../config/globals';

enum LOG_LABEL {
    THERMOSTAT = 'THERMOSTAT',
    HEATER_OFF = '  HEATER_0',
    HEATER_ON = '  HEATER_1',
}
const thisDir = __dirname; // /home/sjfox/code/raspi-home-server/server/src/service/pi
const logPath = `${thisDir}/../../../logs/logs.v1.txt`;

let lastLogCache: Record<string, object> = {};
function writeLog(label: LOG_LABEL, data: object) {
    // [TODO] mock this module for testing instead of node env
    if (isTestEnv || !data) return;

    const stringified = JSON.stringify(data);
    fs.appendFileSync(logPath, '\n' + label + '::' + stringified, 'utf-8');
}

export function writeThermometerLog(thermometer: Thermometer) {
    const cache = lastLogCache[thermometer.chipId] as unknown as Thermometer;
    if (cache?.tempF === thermometer.tempF) return;
    lastLogCache[thermometer.chipId] = thermometer;

    writeLog(LOG_LABEL.THERMOSTAT, thermometer);
}

export function writeHeaterLog(heater: Heater) {
    const cache = lastLogCache[heater.chipId] as unknown as Heater;
    if (cache?.heaterPinVal === heater.heaterPinVal) return;
    lastLogCache[heater.chipId] = heater;

    const label =
        heater.heaterPinVal === 1 ? LOG_LABEL.HEATER_ON : LOG_LABEL.HEATER_OFF;

    writeLog(label, heater);
}
