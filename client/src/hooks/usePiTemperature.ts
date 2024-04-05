import { useEffect, useState } from "react";
import { RASP_PI } from "../../../constant/constant";
import { PiTemp } from "../../../types/main";

const path = `http://${RASP_PI.ip}:${RASP_PI.serverPort}/api/home/pi/temperature`;
export default function usePiTemperature() {
  const [state, setState] = useState({} as PiTemp);

  useEffect(() => {
    const sse = new EventSource(path);
    sse.onmessage = (e) => setState(JSON.parse(e.data));
    sse.onerror = console.error;
  }, []);

  return [state];
}
