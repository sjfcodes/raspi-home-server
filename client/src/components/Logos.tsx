import bitcoinLogo from "../assets/bitcoin.svg";
import espressifLogo from "../assets/espressif.svg";
import nodeLogo from "../assets/node-js.svg";
import raspberryPiLogo from "../assets/raspberry-pi.svg";
import reactLogo from "../assets/react.svg";
import viteLogo from "../assets/vite.svg";

export default function Logos() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div>
        <a href="https://bitcoin.org/en/bitcoin-core/" target="_blank">
          <img src={bitcoinLogo} className="logo" alt="Bitcoin logo" />
        </a>
        <a href="https://www.raspberrypi.com/" target="_blank">
          <img src={raspberryPiLogo} className="logo" alt="Raspbery Pi logo" />
        </a>
        <a
          href="https://www.espressif.com/en/products/socs/esp32"
          target="_blank"
        >
          <img src={espressifLogo} className="logo" alt="Espressif logo" />
        </a>
        <a href="https://nodejs.org/en" target="_blank">
          <img src={nodeLogo} className="logo" alt="Node.js logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo" alt="React logo" />
        </a>
        <a href="https://vitejs.dev/" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
      </div>
    </div>
  );
}
