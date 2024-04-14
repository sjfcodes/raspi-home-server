import { RemoteStateMap } from "../../../../types/main";
import Card from "../Card";
import JsonCode from "../JsonCode";

type Props = { state: RemoteStateMap };
export default function RemoteState({ state }: Props) {

  return (
    <Card
      label={`Remote State`}
      content={
        <div style={{ width: "100%", overflow: "scroll" }}>
          <JsonCode code={JSON.stringify(state, null, 2)} />
        </div>
      }
    />
  );
}
