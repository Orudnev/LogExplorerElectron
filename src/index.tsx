import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './app';
import { Provider } from 'react-redux';
import { HashRouter} from 'react-router-dom'
import reportWebVitals from './reportWebVitals';
import {store} from './Reducers/index';



//"concurrently \"cross-env BROWSER=none yarn start\" \"wait-on http://127.0.0.1:3000 && electron . --inspect=5858  --remote-debugging-port=9223\""
//"electron:dev": "concurrently \"cross-env BROWSER=none yarn start\" \"wait-on http://127.0.0.1:3000 && tsc -p electron -w\" \"wait-on http://127.0.0.1:3000 && tsc -p electron && electron .\"",

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <Provider store={store}>
      <HashRouter>
        <App />
      </HashRouter>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
