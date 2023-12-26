import { useEffect, useState } from "react";
import { CHANNEL } from "../../../constant/constant";
import { PiTemp } from "../../../types/main";
import { socket } from "../utils/socket";

export default function usePiTemp() {
    const [piTemp, setPiTemp] = useState({} as PiTemp)

    useEffect(() => {
        socket.on(CHANNEL.PI_TEMP, (newState: PiTemp) => {
            console.log('in :', newState)
            setPiTemp(newState);
        });
    }, [])

    return { piTemp }
}