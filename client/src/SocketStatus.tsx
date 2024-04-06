import { CSSProperties, useEffect, useState } from "react";
import { socket } from "./utils/socket";

export default function SocketStatus({
  style = {},
}: {
  style?: CSSProperties;
}) {
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

  useEffect(() => {
    let timeout: number;
    if (!online) {
      timeout = setTimeout(() => {
        location.reload();
      }, 3000);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [online]);

  return (
    <span className={online ? "text-green" : "text-red"} style={style}>
      {online ? "online" : "offline"}
    </span>
  );
}
