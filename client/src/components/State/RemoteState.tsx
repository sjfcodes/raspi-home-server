import useRemote from "../../hooks/useRemote";
import Card from "../Card";
import JsonCode from "../JsonCode";

export default function RemoteState() {
  const [state] = useRemote();

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
