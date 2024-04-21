import QRCode from "react-qr-code";
import OldCard from "./Old.Card";

export default function QrCode({ value }: { value: string }) {
  return (
    <OldCard
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
            borderRadius: ".5em",
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
