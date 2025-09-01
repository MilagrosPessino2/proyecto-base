import * as ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

// Esto lo puse para que no moleste un warning de React Router.
const originalWarn = console.warn;
console.warn = (...args) => {
    if (args[0]?.includes('React Router Future Flag Warning')) return;
    originalWarn(...args);
};

ReactDOM.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>,
    document.getElementById('root')
);
