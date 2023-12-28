import useLogStream from "../hooks/useLogStream";
import Card from "./Card";
import JsonCode from "./JsonCode";

export default function LogStream() {
  const { logs } = useLogStream();

  const value = JSON.stringify(logs, null, 1);
  return (
    <Card
      label={<h2>Logs:</h2>}
      showContent={true}
      content={<JsonCode code={value} />}
    />
  );
}
