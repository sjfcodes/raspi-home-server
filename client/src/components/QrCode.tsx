import QRCode from "react-qr-code";
import Card from "./Card";

export default function QrCode({ value }: { value: string }) {
  return (
    <Card
      label="QR Code"
      content={
        // Can be anything instead of `maxWidth` that limits the width.
        <div
          style={{
            height: "auto",
            margin: "0 auto",
            maxWidth: "100%",
            width: "90%",
            background: "white",
            padding: "16px",
            borderRadius: "1em",
          }}
        >
          <QRCode
            size={256}
            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            value={value}
            viewBox={`0 0 256 256`}
          />
        </div>
      }
    />
  );
}
