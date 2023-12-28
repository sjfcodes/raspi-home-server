import useLogStream from "../hooks/useLogStream";
import Card from "./Card";

export default function LogStream() {
    const { logs } = useLogStream();

    return (
        <Card label={<h2>Logs:</h2>} showContent={true} content={<textarea rows={6} value={JSON.stringify(logs, null, 1)} onChange={() => null} />} />
    )
}