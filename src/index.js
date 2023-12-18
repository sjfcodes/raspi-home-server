import http from "http";
import { networkInterfaces } from 'os';

const nets = networkInterfaces();
const {address} = nets.wlan0[0]
console.log(address)

const PORT = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.end("Hello dev.to!\n");
});

server.listen(PORT, () => {
  console.log(`Server running at http://${address}:${PORT}.`);
});
