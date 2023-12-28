import useHeaterGpioState from "../hooks/useHeaterGpioState";
import Card from "./Card";
import JsonCode from "./JsonCode";
import Slider from "./Slider/Slider";

export default function HeaterState() {
  const { heaterGpio, togglePin } = useHeaterGpioState();
  const value = JSON.stringify(heaterGpio, null, 4);
  return (
    <Card
      label={
        <div style={{ display: "flex" }}>
          <h2 style={{ marginRight: "1rem" }}>Heater: </h2>
          <Slider checked={heaterGpio.isOn} onChange={() => togglePin()} />
        </div>
      }
      showContent={false}
      content={<JsonCode code={value} />}
    />
  );
}
