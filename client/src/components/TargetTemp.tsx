import { CSSProperties } from "react";
import { HEATER_CAB } from "../../../constant/constant";
import useTargetTemp from "../hooks/useTargetTemp";
import Card from "./Card";
import HeaterState from "./HeaterState";
import JsonCode from "./JsonCode";

const cold = "#6bbcd1";
const hot = "#e23201";

export default function TargetTemp() {
  const { targetTemp, setTargetTempMax, setTargetTempMin } = useTargetTemp();

  const isTempAvailable = typeof targetTemp.min === "number";

  return (
    <Card
      label={
        <div style={{ width: "100%" }}>
          <div
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "center",
              marginBlock: "1rem",
              gap: "1rem",
            }}
          >
            <TempControl
              color={cold}
              isTempAvailable={isTempAvailable}
              temp={targetTemp.min}
              setTemp={setTargetTempMin}
            />
            <HeaterState
              chipId={HEATER_CAB.HOME}
              style={{ fontSize: "2rem", width: "5rem", textAlign: "center" }}
            />
            <TempControl
              color={hot}
              isTempAvailable={isTempAvailable}
              temp={targetTemp.max}
              setTemp={setTargetTempMax}
            />
          </div>
        </div>
      }
      showContent={false}
      content={<JsonCode code={JSON.stringify(targetTemp, null, 4)} />}
    />
  );
}

const TempControl = ({
  color,
  isTempAvailable,
  temp,
  setTemp,
}: {
  color: string;
  isTempAvailable: boolean;
  temp: number;
  setTemp: (max: number) => void;
}) => {
  const numberStyle: CSSProperties = {
    width: "100%",
    textAlign: "center",
    fontSize: "2rem",
  };

  const buttonStyle = {
    width: "5.5rem",
    height: "2.25rem",
    padding: 0,
    fontSize: "2rem",
    border: "none",
    color: "#1a1a1a",
    display: "block",
  };

  return (
    <div>
      <div style={{ ...numberStyle, color }}>
        {isTempAvailable ? temp : "-"}
      </div>
      <div style={{}}>
        <button
          style={{ ...buttonStyle, backgroundColor: hot }}
          onClick={(e) => {
            e.stopPropagation();
            setTemp(temp + 1);
          }}
        >
          +
        </button>
        <br />
        <button
          style={{ ...buttonStyle, backgroundColor: cold }}
          onClick={(e) => {
            e.stopPropagation();
            setTemp(temp - 1);
          }}
        >
          -
        </button>
      </div>
    </div>
  );
};
