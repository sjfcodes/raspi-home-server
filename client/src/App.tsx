import './App.css';
import Block from './components/Block';
import Header from './components/Header/Header';
import SystemTemperatureMap from './components/State/SystemTemperatureState';
import QrCode from './components/QrCode';
import SystemInfo from './components/State/SystemInfoState';
import Zones from './components/Zone/Zones';

export default function App() {
    return (
        <div className="app">
            <Header />
            <Zones />
            <Block />
            <SystemTemperatureMap />
            <Block />
            <SystemInfo />
            <Block />
            <QrCode value={location.href} />
            <Block />
            <footer> sjfcodes</footer>
        </div>
    );
}
