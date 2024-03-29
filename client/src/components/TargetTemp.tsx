import { CSSProperties, useState } from "react";
import { HEATER_CAB } from "../../../constant/constant";
import useHeaterGpoState from "../hooks/useHeaterGpoState";
import useTargetTemp from "../hooks/useTargetTemp";
import JsonCode from "./JsonCode";

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
  const { targetTemp, setTargetMaxWithTrailingMin } = useTargetTemp();
  const { heaterGpo } = useHeaterGpoState(HEATER_CAB.HOME);
  const isTempAvailable = typeof targetTemp.min === "number";
  const [showData, setShowData] = useState(false);
  const displayTemp = isTempAvailable ? targetTemp.max : "-";
  const toggleContent = () => setShowData((curr) => !curr);

  return (
    <div style={{ width: "100%", marginBlock: "2rem" }}>
      <button
        style={{ ...buttonStyle, backgroundColor: hot }}
        onClick={(e) => {
          e.stopPropagation();
          setTargetMaxWithTrailingMin(targetTemp.max + 1);
        }}
      >
        +
      </button>
      <div
        style={{
          ...numberStyle,
          color: heaterGpo.heaterPinVal ? "green" : "red",
        }}
        onClick={toggleContent}
      >
        {showData ? (
          <div
            style={{
              textAlign: "left",
              fontSize: "1rem",
              width: "50%",
              margin: "0 auto",
            }}
          >
            <JsonCode code={JSON.stringify(targetTemp, null, 4)} />
          </div>
        ) : (
          displayTemp
        )}
      </div>
      <button
        style={{ ...buttonStyle, backgroundColor: cold }}
        onClick={(e) => {
          e.stopPropagation();
          setTargetMaxWithTrailingMin(targetTemp.max - 1);
        }}
      >
        -
      </button>
    </div>
  );
}
