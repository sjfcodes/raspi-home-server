import { useEffect, useState } from "react";
import { RASP_PI } from "../../../constant/constant";

export default function useHeaterSse() {
  const [state, setState] = useState(null);

  useEffect(() => {
    const sse = new EventSource(
      `http://${RASP_PI.ip}:${RASP_PI.serverPort}/api/home`
    );

    sse.onmessage = (e) => {
      console.info(e.data);
      setState(JSON.parse(e.data));
    };
  }, []);

  return [state];
}
