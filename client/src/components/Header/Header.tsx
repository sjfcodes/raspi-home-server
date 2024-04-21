import bitcoinLogo from '../../assets/bitcoin.svg';
import espressifLogo from '../../assets/espressif.svg';
import nodeLogo from '../../assets/node-js.svg';
import raspberryPiLogo from '../../assets/raspberry-pi.svg';
import reactLogo from '../../assets/react.svg';
import viteLogo from '../../assets/vite.svg';
import './header.css';

const technologies = [
    {
        href: 'https://bitcoin.org/en/bitcoin-core/',
        src: bitcoinLogo,
        alt: 'bitcoin logo',
    },
    {
      href: "https://www.raspberrypi.com/",
      src: raspberryPiLogo,
      alt: 'Raspbery Pi logo',
    },
    {
      href: "https://www.espressif.com/en/products/socs/esp32",
      src: espressifLogo,
      alt: 'Espressif logo',
    },
    {
      href: "https://nodejs.org/en",
      src: nodeLogo,
      alt: 'Node.js logo',
    },
    {
      href: "https://react.dev",
      src: reactLogo,
      alt: 'React logo',
    },
    {
      href: "https://vitejs.dev/",
      src: viteLogo,
      alt: 'Vite logo',
    },

];

export default function Header() {
    const items = technologies.map((item, idx) => (
        <a key={idx} href={item.href} target="_blank">
            <img src={item.src} className="logo" alt={item.alt} />
        </a>
    ));
    return (
        <header>
            {items}
        </header>
    );
}
