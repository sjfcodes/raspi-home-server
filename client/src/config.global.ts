import { RASP_PI } from '../../constant/constant';

const host = `http://${RASP_PI.ip}:${RASP_PI.serverPort}`;
const version = '/api/v1';
const api = host + version;

export const urls = {
    heater: {
        get: api + '/heater?subscribe=true',
        put: api + '/heater',
    },
    thermostat: {
        get: api + '/thermostat?subscribe=true',
        put: api + '/thermostat',
    },
    system: {
        temperature: {
            get: api + '/system/temperature?subscribe=true',
        },
        information: {
            get: api + '/system/information',
        },
    },
    thermometer: {
        get: api + '/thermometer?subscribe=true',
    },
    zone: {
        get: api + '/zone',
    },
};
