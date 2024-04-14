import { CSSProperties, useState } from "react";
import JsonCode from "./JsonCode";
import { HeaterCabStateMap } from "../../../types/main";
import { useAtom } from "jotai";
import {
  remoteMapAtom,
  remoteTempDown,
  remoteTempUp,
} from "../store/remoteMap/remoteMap.atom";

const cold = "#6bbcd1";
const hot = "#e23201";

const numberStyle: CSSProperties = {
  width: "100%",
  textAlign: "center",
  fontSize: "2rem",
};

const buttonStyle = {
  width: "100%",
  height: "2.5rem",
  padding: 0,
  margin: "0 auto",
  fontSize: "2rem",
  border: "none",
  color: "#1a1a1a",
  display: "block",
};

type Props = {
  remoteId: string;
  heaterId: string;
  heaterState?: HeaterCabStateMap;
};
export default function HomeRemote({ remoteId, heaterId, heaterState }: Props) {
  const [remoteMap] = useAtom(remoteMapAtom);
  const [showData, setShowData] = useState(false);

  const heater = heaterState?.[heaterId];
  if (!heater) return null;

  const remote = remoteMap?.[remoteId];
  if (!remote) return null;

  const isTempAvailable = typeof remote?.min === "number";
  const displayTemp = isTempAvailable ? remote.max : "-";

  return (
    <div style={{ width: "100%" }}>
      <button
        style={{ ...buttonStyle, backgroundColor: hot }}
        onClick={(e) => {
          e.stopPropagation();
          remoteTempUp(remoteId);
        }}
      >
        +
      </button>
      <div
        style={{
          ...numberStyle,
          color: heater.heaterPinVal ? "green" : "red",
          height: "5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onClick={(e) => {
          e.stopPropagation();
          setShowData((curr) => !curr);
        }}
      >
        {showData ? (
          <div
            style={{
              textAlign: "center",
              fontSize: ".75rem",
              width: "100%",
              margin: "0 auto",
            }}
          >
            <JsonCode code={JSON.stringify(remote)} />
          </div>
        ) : (
          displayTemp
        )}
      </div>
      <button
        style={{ ...buttonStyle, backgroundColor: cold }}
        onClick={(e) => {
          e.stopPropagation();
          remoteTempDown(remoteId);
        }}
      >
        -
      </button>
    </div>
  );
}
