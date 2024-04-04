import { RASP_PI } from "../../constant/constant";
import { checkHeaterStatus } from "./service/esp32/heater";
import { setEsp32Client } from "./service/esp32/temperature";
import { setPiTemp } from "./service/pi/temperature";
import { app } from "./service/server";
import { ipAddress } from "./utils/ipAddress";

const { PORT = RASP_PI.serverPort } = process.env;
const LOOP_MS = 1000;

app.post("/api/temperature", (req, res) => {
  if (req.body) setEsp32Client(req.body);
  res.status(200).send({ ...req.body, serverName: "raspi-home-server" });
});


app.listen(PORT, () => {
  setInterval(checkHeaterStatus, LOOP_MS);
  setInterval(setPiTemp, LOOP_MS);
  console.log(`Running server at http://${ipAddress}:${PORT}.`);
});
