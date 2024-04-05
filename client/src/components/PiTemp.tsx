import useRaspberryPi from "../hooks/useRaspberryPi";
import Card from "./Card";
import JsonCode from "./JsonCode";

export default function PiTemp() {
  const [piTemp] = useRaspberryPi();

  // 85℃ (185℉) max rasbperry pi temp
  const percentage = (piTemp.tempF / 185) * 100;

  const value = JSON.stringify(piTemp, null, 4);
  return (
    <Card
      label={`Pi Temp: ${piTemp.tempF ? piTemp.tempF + "℉" : "-"} (${
        isNaN(percentage) ? "-" : Math.trunc(percentage) + "%"
      })`}
      content={<JsonCode code={value} />}
    />
  );
}
