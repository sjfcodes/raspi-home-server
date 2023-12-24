import { useEffect, useState } from "react";
import { CHANNEL } from "../../../constant/constant";
import { Esp32ClientMap } from "../../../types/main";
import { socket } from "../utils/socket";

export default function useEsp32TempClientMap() {
    const [esp32TempClientMap, setEsp32TempClientMap] = useState({} as Esp32ClientMap)

    useEffect(() => {
        socket.on(CHANNEL.ESP32_TEMP_CLIENT_MAP, (newState: Esp32ClientMap) => {
            console.log('in :', newState)
            setEsp32TempClientMap(newState);
        });
    }, [])

    return { esp32TempClientMap }
}