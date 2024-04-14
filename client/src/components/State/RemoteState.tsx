import { useAtom } from "jotai";
import Card from "../Card";
import JsonCode from "../JsonCode";
import { remoteMapAtom } from "../../store/remoteMap/remoteMap.atom";

export default function RemoteState() {
  const [remoteState] = useAtom(remoteMapAtom);

  return (
    <Card
      label={`Remote State`}
      content={
        <div style={{ width: "100%", overflow: "scroll" }}>
          <JsonCode code={JSON.stringify(remoteState, null, 2)} />
        </div>
      }
    />
  );
}
