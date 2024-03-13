import { CSSProperties } from "react";
import useHeaterGpoState from "../hooks/useHeaterGpoState";

export default function HeaterState({
  chipId,
  style = {},
}: {
  chipId: string;
  style?: CSSProperties;
}) {
  const { heaterGpo } = useHeaterGpoState(chipId);

  const status = (
    <span
      className={`${!!heaterGpo.heaterPinVal ? "text-green" : ""}`}
      style={style}
    >
      {!!heaterGpo.heaterPinVal ? "on" : "off"}
    </span>
  );

  return status;

  // return (
  //   <Card
  //     label={
  //       <div style={{ display: "flex" }}>
  //         <h2 style={{ marginRight: "1rem" }}>
  //           Heater:{" "}
  //           {heaterGpo.heaterPinVal === null ? (
  //             "-"
  //           ) : status}
  //         </h2>
  //       </div>
  //     }
  //     showContent={false}
  //     content={<JsonCode code={JSON.stringify(heaterGpo, null, 4)} />}
  //   />
  // );
}
