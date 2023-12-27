import { useEffect, useState } from "react";
import { CHANNEL } from "../../../constant/constant";
import { PiTemp } from "../../../types/main";
import { socket } from "../utils/socket";

export default function useLogStream() {
    const [logs, setLogs] = useState({} as PiTemp)

    useEffect(() => {
        socket.on(CHANNEL.LOG_STREAM, (newState: PiTemp) => {
            console.log('in :', newState)
            setLogs(newState);
        });
    }, [])

    return { logs }
}