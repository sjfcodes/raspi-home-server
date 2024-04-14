import { useEffect, useState } from "react";
import { RASP_PI } from "../../../constant/constant";

const path = `http://${RASP_PI.ip}:${RASP_PI.serverPort}/api/home/pi/logs`;
export default function usePiLogs() {
  const [state, setState] = useState([] as string[]);

  useEffect(() => {
    const sse = new EventSource(path);
    sse.onmessage = (e) => {
      console.log('onmessage', path);
      setState(JSON.parse(e.data))
    };
    sse.onerror = console.error;
  }, []);

  return [state];
}
