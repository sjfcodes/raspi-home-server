import { RASP_PI } from "../../constant/constant";
import { initHeaterApp } from "./service/esp32/heater";
import { initHomeCron } from "./service/esp32/homeCron";
import { setThermostatClient } from "./service/esp32/thermostat";
import { setPiTemp } from "./service/pi/temperature";
import { app } from "./service/server";
import { ipAddress } from "./utils/ipAddress";

const { PORT = RASP_PI.serverPort } = process.env;
const LOOP_MS = 1000;

app.post("/api/temperature", (req, res) => {
    if (req.body) setThermostatClient(req.body);
    res.status(200).send({ ...req.body, serverName: "raspi-home-server" });
});

initHeaterApp();
initHomeCron();

app.listen(PORT, () => {
    setInterval(setPiTemp, LOOP_MS);
    console.log(`Running server at http://${ipAddress}:${PORT}`);
});
