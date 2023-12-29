import { useEffect, useState } from "react";
import { CHANNEL } from "../../../constant/constant";
import { RoomTempState } from "../../../types/main";
import { socket } from "../utils/socket";

export default function useRoomTemp() {
  const [roomTemp, setRoomTemp] = useState({} as RoomTempState);

  useEffect(() => {
    socket.on(CHANNEL.TARGET_TEMP, (newState: RoomTempState) => {
      console.log("in :", newState);
      setRoomTemp(newState);
    });
  }, []);

  const setRoomTempMin = (min: number) => {
    setRoomTemp((curr) => {
      const newState: RoomTempState = { ...curr, min };
      console.log("out:", newState);
      socket.emit(CHANNEL.TARGET_TEMP, newState);
      return newState;
    });
  };

  const setRoomTempMax = (max: number) => {
    setRoomTemp((curr) => {
      const newState: RoomTempState = { ...curr, max };
      console.log("out:", newState);
      socket.emit(CHANNEL.TARGET_TEMP, newState);
      return newState;
    });
  };

  return { roomTemp, setRoomTempMin, setRoomTempMax };
}
