import useTargetTemp from "../hooks/useTargetTemp";
import Card from "./Card";
import JsonCode from "./JsonCode";

export default function TargetTemp() {
  const { targetTemp, setTargetTempMax, setTargetTempMin } = useTargetTemp();

  const setTempMin: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setTargetTempMin(Number(e.target.value));
  };
  const setTempMax: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setTargetTempMax(Number(e.target.value));
  };
  const inputStyle = {
    width: "3.5rem",
    marginInline: ".5rem",
    fontSize: "2rem",
  };

  return (
    <Card
      label={
        <div style={{ display: "flex", alignItems: "center" }}>
          <h2>Target temp: </h2>
          <input
            type="number"
            style={inputStyle}
            value={targetTemp.min || 0}
            onChange={setTempMin}
            onClick={(e) => e.stopPropagation()}
          />
          -
          <input
            type="number"
            style={inputStyle}
            value={targetTemp.max || 0}
            onChange={setTempMax}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      }
      showContent={false}
      content={<JsonCode code={JSON.stringify(targetTemp, null, 4)} />}
    />
  );
}
