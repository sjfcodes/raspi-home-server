import { HeaterCabStateMap } from "../../../../types/main";
import Card from "../Card";
import JsonCode from "../JsonCode";

type Props = { state: HeaterCabStateMap };
export default function HeaterState({ state }: Props) {
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
