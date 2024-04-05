import { useEffect, useState } from "react";
import { RASP_PI } from "../../../constant/constant";

export default function usePiLogs() {
  const [state, setState] = useState([] as string[]);

  useEffect(() => {
    const sse = new EventSource(
      `http://${RASP_PI.ip}:${RASP_PI.serverPort}/api/home/pi/logs`
    );

    sse.onmessage = (e) => {
      setState(JSON.parse(e.data));
    };
  }, []);

  return [state];
}
