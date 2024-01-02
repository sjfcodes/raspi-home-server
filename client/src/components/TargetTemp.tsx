import useTargetTemp from "../hooks/useTargetTemp";
import Card from "./Card";
import JsonCode from "./JsonCode";

export default function TargetTemp() {
  const { targetTemp, setTargetTempMax, setTargetTempMin } = useTargetTemp();

  const setTempMin: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const num = Number(e.target.value);
    if (!isNaN(num)) setTargetTempMin(Number(e.target.value));
  };

  const setTempMax: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const num = Number(e.target.value);
    if (!isNaN(num)) setTargetTempMax(Number(e.target.value));
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
            type="text"
            style={inputStyle}
            defaultValue={targetTemp.min}
            onClick={(e) => e.stopPropagation()}
            onBlur={setTempMin}
          />
          -
          <input
            type="text"
            style={inputStyle}
            defaultValue={targetTemp.max}
            onClick={(e) => e.stopPropagation()}
            onBlur={setTempMax}
          />
        </div>
      }
      showContent={false}
      content={<JsonCode code={JSON.stringify(targetTemp, null, 4)} />}
    />
  );
}
