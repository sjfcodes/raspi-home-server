import { useEffect, useState } from "react";
import { RASP_PI } from "../../../constant/constant";
import { PiTemp } from "../../../types/main";

export default function usePiTemperature() {
  const [state, setState] = useState({} as PiTemp);

  useEffect(() => {
    const sse = new EventSource(
      `http://${RASP_PI.ip}:${RASP_PI.serverPort}/api/home/pi/temperature`
    );

    sse.onmessage = (e) => {
      setState(JSON.parse(e.data));
    };
  }, []);

  return [state];
}
