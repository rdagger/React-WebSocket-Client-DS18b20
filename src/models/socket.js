import { applyAction } from 'mobx-state-tree';

export default function syncStoreWS(socket, sensor) {
  function onSocketMessage(handler) {
    socket.onmessage = (event) => {
      handler(JSON.parse(event.data));
    };
  }

  onSocketMessage((data) => {
    if (Object.prototype.hasOwnProperty.call(data, 'temp')) {
      applyAction(sensor, { name: 'setTemperature', args: [data.temp] });
    }
  });
}
