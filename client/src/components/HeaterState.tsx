import useHeaterGpoState from "../hooks/useHeaterGpoState";
import Card from "./Card";
import JsonCode from "./JsonCode";
import Slider from "./Slider/Slider";

export default function HeaterState() {
  const { heaterGpo, togglePin } = useHeaterGpoState();
  const value = JSON.stringify(heaterGpo, null, 4);
  return (
    <Card
      label={
        <div style={{ display: "flex" }}>
          <h2 style={{ marginRight: "1rem" }}>Heater: </h2>
          <Slider
            checked={heaterGpo.heaterPinVal}
            onChange={() => togglePin()}
          />
        </div>
      }
      showContent={false}
      content={<JsonCode code={value} />}
    />
  );
}
