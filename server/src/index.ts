
import { RASP_PI } from "../../constant/constant";
import { initHomeHeater } from "./service/esp32/heater";
import { initHomeCron } from "./service/esp32/homeCron";
import { initAllThermostats } from "./service/esp32/thermostat";
import { initPiState } from "./service/pi/temperature";
import { app } from "./service/server";
import { log } from "./utils/general";
import { ipAddress } from "./utils/ipAddress";

const { PORT = RASP_PI.serverPort } = process.env;

initAllThermostats();
initHomeHeater();
initHomeCron();
initPiState();

app.listen(PORT, () => log('server', `listen (http://${ipAddress}:${PORT})`));
