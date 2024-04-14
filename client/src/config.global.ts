import { RASP_PI } from "../../constant/constant";

const server = `http://${RASP_PI.ip}:${RASP_PI.serverPort}`;

export const urls = {
  remote: {
    get: server + "/api/v1/remote?subscribe=true",
    put: server + "/api/v1/remote",
  },
};
