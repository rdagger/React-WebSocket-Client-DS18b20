import { types } from 'mobx-state-tree';

const Ds18b20 = types
  .model({
    temperature: 0,
    isReady: false,
  })
  .actions(self => ({
    setTemperature(temp) {
      self.temperature = temp;
      self.isReady = true;
    },
  }))
  .views(self => ({
    get convertFahrenheit() {
      return ((self.temperature * 1.8) + 32).toFixed(2);
    },
  }));
export default Ds18b20;
