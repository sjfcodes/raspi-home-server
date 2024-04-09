import { RASP_PI } from '../../constant/constant';
import { initHomeHeater } from './service/esp32/heater';
import { initHomeCron } from './service/esp32/homeCron';
import { initAllThermostats } from './service/esp32/thermostat';
import { initPiTemperature } from './service/pi/temperature';
import { initHomeTargetTemp } from './service/room/temperature';
import { server } from './service/server';
import { log } from './utils/general';
import { ipAddress } from './utils/ipAddress';

const { PORT = RASP_PI.serverPort } = process.env;

initAllThermostats();
initHomeHeater();
initHomeCron();
initPiTemperature();
initHomeTargetTemp();

server.listen(PORT, () =>
    log('server', 'listen', `http://${ipAddress}:${PORT}`),
);
