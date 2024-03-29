import { CSSProperties, useState } from "react";
import { HEATER_CAB } from "../../../../constant/constant";
import useHeaterGpoState from "../../hooks/useHeaterGpoState";
import useRoomTemp from "../../hooks/useRoomTemp";
import JsonCode from "../JsonCode";

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

export default function TargetTemp() {
  const { roomTemp, setTargetMaxWithTrailingMin } = useRoomTemp();
  console.log("roomTemp", roomTemp);
  const { heaterGpo } = useHeaterGpoState(HEATER_CAB.HOME);
  const isTempAvailable = typeof roomTemp.min === "number";
  const [showData, setShowData] = useState(false);
  const displayTemp = isTempAvailable ? roomTemp.max : "-";

  return (
    <div style={{ width: "100%" }}>
      <button
        style={{ ...buttonStyle, backgroundColor: hot }}
        onClick={(e) => {
          e.stopPropagation();
          setTargetMaxWithTrailingMin(roomTemp.max + 1);
        }}
      >
        +
      </button>
      <div
        style={{
          ...numberStyle,
          color: heaterGpo.heaterPinVal ? "green" : "red",
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
              fontSize: "1rem",
              width: "100%",
              margin: "0 auto",
            }}
          >
            <JsonCode code={JSON.stringify(roomTemp)} />
          </div>
        ) : (
          displayTemp
        )}
      </div>
      <button
        style={{ ...buttonStyle, backgroundColor: cold }}
        onClick={(e) => {
          e.stopPropagation();
          setTargetMaxWithTrailingMin(roomTemp.max - 1);
        }}
      >
        -
      </button>
    </div>
  );
}
