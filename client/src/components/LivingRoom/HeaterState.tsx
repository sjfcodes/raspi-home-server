import { CSSProperties } from "react";
import useHeaterGpoState from "../../hooks/useHeaterGpoState";

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
}
