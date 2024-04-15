import './App.css';
import Block from './components/Block';
import Logos from './components/Logos';
import SystemTemperatureMap from './components/State/SystemTemperatureState';
import QrCode from './components/QrCode';
// import ThermostatMap from './components/Thermostats';
import { APP_MAX_WIDTH } from './utils/constants';
import SystemInfo from './components/State/SystemInfoState';
import Zones from './components/Zone/Zones';

export default function App() {
    return (
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
            <Logos />

            <Zones />

            {/* <Block />
            <ThermostatMap /> */}

            <Block />
            <SystemTemperatureMap />

            <Block />
            <SystemInfo />

            <Block />
            <QrCode value={location.href} />
            <Block />
        </div>
    );
}
