import React from 'react';
import PropTypes from 'prop-types';
import logo from './logo.svg';
import './App.css';
import TempGauge from './components/TempGauge';

const App = props => (
  <div className="App">
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <h1 className="App-title">ESP32 Websockets Demo</h1>
    </header>
    <TempGauge sensor={props.sensor} />
  </div>
);

App.propTypes = {
  sensor: PropTypes.shape({
    isReady: PropTypes.bool,
    convertFahrenheit: PropTypes.string,
  }).isRequired,
};

export default App;
