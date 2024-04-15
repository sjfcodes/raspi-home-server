import fs from 'fs';
import { Heater, Thermostat } from '../../../types/main';

const thisDir = __dirname; // /home/sjfox/code/raspi-home-server/server/src/service/pi
const logPath = `${thisDir}/../../../logs/logs.txt`;
let lastLogCache: Record<string, object> = {};
function writeLog(data: object) {
    if (!data) return;

    const stringified = JSON.stringify(data);
    fs.appendFileSync(logPath, '\n' + stringified, 'utf-8');
}

export function writeThermostatLog(thermostat: Thermostat) {
    const cache = lastLogCache[thermostat.chipId] as unknown as Thermostat;
    if (cache?.tempF === thermostat.tempF) return;
    lastLogCache[thermostat.chipId] = thermostat;

    writeLog(thermostat);
}

export function writeHeaterLog(heater: Heater) {
    const cache = lastLogCache[heater.chipId] as unknown as Heater;
    if (cache?.heaterPinVal === heater.heaterPinVal) return;
    lastLogCache[heater.chipId] = heater;

    writeLog(heater);
}
