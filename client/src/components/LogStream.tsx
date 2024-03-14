import { CSSProperties, useMemo } from "react";
import { AxisOptions, Chart } from "react-charts";
import useLogStream from "../hooks/useLogStream";

type Temps = {
  date: Date;
  temp: number;
};

type Series = {
  label: string;
  data: Temps[];
};

export default function LogStream({ style = {} }: { style?: CSSProperties }) {
  const { logs } = useLogStream();

  const format = useMemo(
    () =>
      logs.reduce(
        (acc, curr) => {
          // '2024-03-13T07:30:30.983Z: current temp is 69'
          const [dateStr, message] = curr.split(": ");
          if (message.includes("current temp is ")) {
            const temp = Number(message.replace("current temp is ", ""));
            if (!isNaN(temp)) {
              const date = new Date(dateStr);
              acc.data.push({ date, temp });
            }
          }

          return acc;
        },
        { label: "logs", data: [] as Temps[] }
      ),
    [logs[0]]
  );

  const primaryAxis = useMemo(
    (): AxisOptions<Temps> => ({
      getValue: (datum) => datum.date,
      scaleType: "localTime",
    }),
    []
  );
  const secondaryAxes = useMemo(
    (): AxisOptions<Temps>[] => [
      {
        getValue: (datum) => datum.temp,
      },
    ],
    []
  );

  if (!format.data.length) return null;

  return (
    <div
      style={{
        border: "1px solid orange",
        backgroundColor: "white",
        height: "300px",
      }}
    >
      <Chart
        options={{
          data: [format],
          primaryAxis,
          secondaryAxes,
        }}
      />
    </div>
  );
}
