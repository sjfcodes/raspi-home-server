import useHomeHeater from "../../hooks/useHomeHeater";
import Card from "../Card";
import JsonCode from "../JsonCode";

export default function HomeHeaterState() {
  const [state] = useHomeHeater();

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
