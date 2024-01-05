import { useEffect, useState } from "react";
import { socket } from "./utils/socket";

export default function SocketStatus() {
  const [online, setOnline] = useState(false);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("socket.on.connect");
      setOnline(true);
    });

    socket.on("disconnect", () => {
      console.log("socket.on.disconnect");
      setOnline(false);
    });
  }, []);

  return (
    <span className={online ? "text-green" : "text-red"}>
      {online ? "online" : "offline"}
    </span>
  );
}
