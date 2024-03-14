import usePiTemp from "../hooks/usePiTemp";
import Card from "./Card";
import JsonCode from "./JsonCode";

export default function PiTemp() {
  const { piTemp } = usePiTemp();

  // 85℃ (185℉) max rasbperry pi temp
  const percentage = (piTemp.tempF / 185) * 100;

  const value = JSON.stringify(piTemp, null, 4);
  return (
    <Card
      label={
        <div style={{ width: "100%", fontSize: "1.5rem" }}>{`Pi Temp: ${
          piTemp.tempF ? piTemp.tempF + "℉" : "-"
        } (${isNaN(percentage) ? "-" : Math.trunc(percentage) + "%"})`}</div>
      }
      showContent={false}
      content={<JsonCode code={value} />}
    />
  );
}
