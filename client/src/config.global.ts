import { RASP_PI } from '../../constant/constant';

const host = `http://${RASP_PI.ip}:${RASP_PI.serverPort}`;
const version = '/api/v1';
const api = host + version;

export const urls = {
    heater: {
        get: api + '/heater?subscribe=true',
        put: api + '/heater',
    },
    remote: {
        get: api + '/remote?subscribe=true',
        put: api + '/remote',
    },
    system: {
        temperature: {
            get: api + '/system/temperature?subscribe=true',
        },
        information: {
            get: api + '/system/information',
        },
    },
    thermostat: {
        get: api + '/thermostat?subscribe=true',
    },
    zone: {
        get: api + '/zone',
    },
};
