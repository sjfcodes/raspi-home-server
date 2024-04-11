import useThermostat from "../../hooks/useThermostat";
import Card from "../Card";
import JsonCode from "../JsonCode";

export default function ThermostatState() {
  const [state] = useThermostat();

  return (
    <Card
      label={`Thermostat State`}
      content={
        <div style={{ width: "100%", overflow: "scroll" }}>
          <JsonCode code={JSON.stringify(state, null, 2)} />
        </div>
      }
    />
  );
}
