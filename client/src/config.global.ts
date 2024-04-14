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
    thermostat: {
        get: api + '/thermostat?subscribe=true',
    },
};
