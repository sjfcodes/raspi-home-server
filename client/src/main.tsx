import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { store } from './store/store.global';
import { Provider } from 'jotai';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
        <App />
    </Provider>
);
