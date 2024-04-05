import { useEffect, useState } from "react";
import { RASP_PI } from "../../../constant/constant";
import { PiTemp } from "../../../types/main";

export default function usePiSse() {
  const [state, setState] = useState({} as PiTemp);

  useEffect(() => {
    const sse = new EventSource(
      `http://${RASP_PI.ip}:${RASP_PI.serverPort}/api/home/pi`
    );

    sse.onmessage = (e) => {
      setState(JSON.parse(e.data));
    };
  }, []);

  return [state];
}
