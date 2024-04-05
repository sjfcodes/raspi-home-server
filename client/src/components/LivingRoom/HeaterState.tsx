import useHeaterSse from "../../hooks/useHeaterSse";
import Card from "../Card";
import JsonCode from "../JsonCode";

export default function HeaterState() {
  const [state] = useHeaterSse();

  return (
    <Card
      label={`House Heater Cabinet`}
      content={
        <div style={{ width: "100%", overflow: "scroll" }}>
          <JsonCode code={JSON.stringify(state, null, 4)} />
        </div>
      }
    />
  );
}
