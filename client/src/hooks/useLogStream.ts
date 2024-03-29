import { useEffect, useState } from "react";

import { CHANNEL } from "../../../constant/constant";
import { socket, socketLogger } from "../utils/socket";

export default function useLogStream() {
  const [logs, setLogs] = useState([] as string[]);

  useEffect(() => {
    socket.on(CHANNEL.LOG_STREAM, (newLogs: string[]) => {
      setLogs((curr) => [...newLogs, ...curr]);
      socketLogger(CHANNEL.LOG_STREAM, "in", newLogs);
    });
  }, []);

  return { logs };
}
