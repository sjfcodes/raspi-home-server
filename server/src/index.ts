import { setEsp32Client } from "./service/esp32/temperature";
import { checkHeaterStatus } from "./service/gpio/heater";
import { setPiTemp } from "./service/pi/temperature";
import { app, server } from "./service/server";
import { ipAddress } from "./utils/ipAddress";

const { PORT = 3000 } = process.env;
const LOOP_MS = 1000;

app.post("/api/temperature", (req, res) => {
  if (req.body) setEsp32Client(req.body);
  res.status(200).send({ ...req.body, serverName: "raspi-home-server" });
});

server.listen(PORT, () => {
  setInterval(checkHeaterStatus, LOOP_MS);
  setInterval(setPiTemp, LOOP_MS);
  console.log(`Running server at http://${ipAddress}:${PORT}.`);
});

// ["SIGINT", "SIGTERM", "SIGQUIT"].forEach((signal) =>
//   process.on(signal, () => {
//     setHeaterGpoOff();
//     heaterGpo.destroy();
//     process.exit();
//   })
// );
