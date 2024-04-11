import { CSSProperties, useState } from "react";
import useRemote from "../hooks/useRemote";
import JsonCode from "./JsonCode";
import useHeater from "../hooks/useHeater";

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

export default function HomeRemote() {
  const { data: roomTemp, decrement, increment } = useRemote();
  const [heaterGpo] = useHeater();
  const [showData, setShowData] = useState(false);

  if (!heaterGpo) return null;

  const isTempAvailable = typeof roomTemp?.min === "number";
  const displayTemp = isTempAvailable ? roomTemp.max : "-";

  return (
    <div style={{ width: "100%" }}>
      <button
        style={{ ...buttonStyle, backgroundColor: hot }}
        onClick={(e) => {
          e.stopPropagation();
          if (typeof roomTemp?.max !== "number") return;
          increment();
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
          if (typeof roomTemp?.max !== "number") return;
          decrement();
        }}
      >
        -
      </button>
    </div>
  );
}
