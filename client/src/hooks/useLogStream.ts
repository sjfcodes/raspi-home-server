import { useEffect, useState } from "react";
import { CHANNEL } from "../../../constant/constant";
import { socket } from "../utils/socket";

export default function useLogStream() {
  const [logs, setLogs] = useState([] as string[]);

  useEffect(() => {
    socket.on(CHANNEL.LOG_STREAM, (newLogs: string[]) => {
      console.log("in :", newLogs);
      setLogs((curr) => [...newLogs, ...curr]);
    });
  }, []);

  return { logs };
}
