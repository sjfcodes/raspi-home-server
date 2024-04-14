import "./App.css";
import Block from "./components/Block";
import PiLogs from "./components/PiLogs";
import Logos from "./components/Logos";
import SystemTemperatureState from "./components/State/SystemTemperatureState";
import QrCode from "./components/QrCode";
import HomeRemote from "./components/HomeRemote";
import Thermostats from "./components/Thermostats";
import { APP_MAX_WIDTH } from "./utils/constants";
import HeaterState from "./components/State/HeaterState";
import RemoteState from "./components/State/RemoteState";
import SystemInfoState from "./components/State/SystemInfoState";
import useHeater from "./hooks/useHeater";
import useRemote from "./hooks/useRemote";

function App() {
  /**
   * [NOTE]
   *    SSE on http (update express to http2, or use fastify?)
   *    is limited to 6 connections. If server has 6 active
   *    connections, the next request will jam the server...
   *    
   *    Import sse connections at top level for single
   *    connections to be passed to children.
   *    A better apporach could be to use jo-tai atoms
   *    and set sse connection within atom. Then one
   *    connection can be accessed by any componet.
   */
  const { data: heaterState } = useHeater();
  const { data: remoteState, decrement, increment } = useRemote();
  return (
    <div
      style={{
        width: "100%",
        maxWidth: APP_MAX_WIDTH,
        height: "100vh",
        margin: "0 auto",
        overflowY: "scroll",
        overflowX: "hidden",
        paddingBottom: "1rem",
      }}
    >
      <Block />
      <Logos />
      <Block />

      <HeaterState state={heaterState} />
      <Block />

      <RemoteState state={remoteState} />
      <Block />

      <HomeRemote
        remoteId="home"
        remoteState={remoteState}
        decrementRemoteState={decrement}
        incrementRemoteState={increment}
        heaterId="d0fc8ad4"
        heaterState={heaterState}
      />
      <HomeRemote
        remoteId="office"
        remoteState={remoteState}
        decrementRemoteState={decrement}
        incrementRemoteState={increment}
        heaterId="d0fc8ad4"
        heaterState={heaterState}
      />
      <Block />

      {/* <PiLogs />
      <Block /> */}

      <div style={{ maxWidth: APP_MAX_WIDTH, overflow: "scroll" }}>
        <Thermostats />
      </div>

      <SystemTemperatureState />
      <Block />

      <SystemInfoState />
      <Block />

      <QrCode value={location.href} />
      <Block />
    </div>
  );
}

export default App;
