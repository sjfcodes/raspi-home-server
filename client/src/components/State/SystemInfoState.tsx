import useSystemInfo from "../../hooks/useSystemInfo";
import Card from "../Card";
import JsonCode from "../JsonCode";

export default function SystemInfoState() {
  const [piTemp] = useSystemInfo();

  return (
    <Card
      label={`Pi System Info`}
      content={<JsonCode code={JSON.stringify(piTemp, null, 2)} />}
    />
  );
}
