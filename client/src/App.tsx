import './App.css';
import { Provider } from 'jotai';
import Block from './components/Block';
import Logos from './components/Logos';
import SystemTemperatureMap from './components/State/SystemTemperatureState';
import QrCode from './components/QrCode';
import Remote from './components/Remote/Remote';
import ThermostatMap from './components/Thermostats';
import { APP_MAX_WIDTH } from './utils/constants';
import HeaterMap from './components/State/HeaterMap';
import SystemInfo from './components/State/SystemInfoState';
import RemoteMap from './components/State/RemoteMap';
import { store } from './store/store.global';

export default function App() {
    /**
     * [NOTE]
     *    SSE on http (update express to http2, or use fastify?)
     *    is limited to 6 connections. If server has 6 active
     *    connections, the next request will jam the server...
     *      checkout: https://github.com/spdy-http2/node-spdy
     *      checkout: https://fastify.dev/docs/v3.29.x/Reference/HTTP2/
     *
     *    Import sse connections at top level for single
     *    connections to be passed to children.
     *    A better apporach could be to use jo-tai atoms
     *    and set sse connection within atom. Then one
     *    connection can be accessed by any componet.
     */

    return (
        <Provider store={store}>
            <div
                style={{
                    width: '100%',
                    maxWidth: APP_MAX_WIDTH,
                    height: '100vh',
                    margin: '0 auto',
                    overflowY: 'scroll',
                    overflowX: 'hidden',
                    paddingBottom: '1rem',
                }}
            >
                <Block />
                <Logos />
                <Block />

                <Remote remoteId="home" heaterId="d0fc8ad4" />
                <Block />

                <HeaterMap />
                <Block />
                <RemoteMap />

                <Remote remoteId="office" heaterId="d0fc8ad4" />
                <Block />

                <ThermostatMap />

                <SystemTemperatureMap />
                <Block />

                <SystemInfo />
                <Block />

                <QrCode value={location.href} />
                <Block />
            </div>
        </Provider>
    );
}
