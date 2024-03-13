import { CSSProperties } from "react";
import useLogStream from "../hooks/useLogStream";
import Card from "./Card";
import JsonCode from "./JsonCode";

export default function LogStream({ style = {} }: { style?: CSSProperties }) {
  const { logs } = useLogStream();

  const value = JSON.stringify(logs, null, 1);
  return (
    <Card
      label={<h2>Logs:</h2>}
      showContent={false}
      content={
        <div style={{ height: "250px", overflowY: 'scroll' }}>
          <JsonCode code={value} />
        </div>
      }
      preview={<span>tap to show</span>}
      style={style}
    />
  );
}
