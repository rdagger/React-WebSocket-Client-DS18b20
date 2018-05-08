import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import syncStoreWS from './models/socket';
import Ds18b20 from './models/sensors';

const socket = new WebSocket('ws://mPy.local');
const sensor = Ds18b20.create();

syncStoreWS(socket, sensor);

ReactDOM.render(<App sensor={sensor} />, document.getElementById('root'));
