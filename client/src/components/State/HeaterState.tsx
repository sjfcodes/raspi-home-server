import useHeater from "../../hooks/useHeater";
import Card from "../Card";
import JsonCode from "../JsonCode";

export default function HeaterState() {
  const [state] = useHeater();

  return (
    <Card
      label={`Heater State`}
      content={
        <div style={{ width: "100%", overflow: "scroll" }}>
          <JsonCode code={JSON.stringify(state, null, 2)} />
        </div>
      }
    />
  );
}
