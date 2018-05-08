import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import Thermometer from 'react-thermometer-component';
import ReactLoading from 'react-loading';

const TempGauge = (props) => {
  if (props.sensor.isReady) {
    return (
      <div style={styles.container}>
        <Thermometer
          theme="light"
          value={props.sensor.convertFahrenheit}
          min="0"
          max="100"
          steps="4"
          format="°F"
          size="large"
          height="300"
        />
      </div>
    );
  }
  return (
    <div style={styles.container}>
      <ReactLoading
        type="spin"
        color="#2196F3"
        width="100"
        height="100"
      />
    </div>
  );
};

TempGauge.propTypes = {
  sensor: PropTypes.shape({
    isReady: PropTypes.bool.isRequired,
    convertFahrenheit: PropTypes.string.isRequired,
  }).isRequired,
};

export default observer(TempGauge);

const styles = {
  container: {
    margin: 'auto',
    width: 100,
    padding: 20,
  },
};
