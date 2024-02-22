import { Middleware } from "@reduxjs/toolkit";
import { SensorID, SensorsCommands, updateSensorData } from ".";

// Action types
const START_SENSOR_LISTENING = "sensors/startListening";
const CONNECT_SENSOR = "sensors/connectSensor";
const DISCONNECT_SENSOR = "sensors/disconnectSensor";

// Define the middleware representing the sensor listener
export const sensorsConnector: Middleware = (store) => {
  // The connection to the server
  let websocket: WebSocket | null = null;

  // In case of disconnection and reconnection we recover the connection status
  let connectionStatusRecovery: { [id: SensorID]: boolean } = {};

  // Function to connect to the server
  const connectWebSocket = () => {
    if (websocket) {
      return; // Already connected
    }

    websocket = new WebSocket(import.meta.env.VITE_SERVER_WS_URL);

    websocket.onopen = () => {
      console.log("Connected to the server");

      // If there are sensors connection status to recover, we do
      if (connectionStatusRecovery) {
        for (const sensorId in connectionStatusRecovery) {
          setSensorConnection(connectionStatusRecovery[sensorId], sensorId);
        }
        connectionStatusRecovery = {};
      } else {
        store.dispatch(connectAllSensors());
      }
    };

    websocket.onmessage = (event) => {
      // Parse incoming sensor data and update state via dispatch
      const sensorData = JSON.parse(event.data);
      store.dispatch(updateSensorData(sensorData));
    };

    websocket.onclose = () => {
      console.log("Disconnected from the server");
      websocket = null;

      // Save the connection status for recovery
      for (const sensorId in store.getState().sensors.allIds) {
        connectionStatusRecovery[sensorId] =
          store.getState().sensors.byId[sensorId].connected;
      }

      // We constantly re-attempt to reconnect
      setTimeout(() => {
        connectWebSocket();
      }, 100);
    };
  };

  const setSensorConnection = (activate: boolean, id: SensorID) => {
    if (websocket) {
      websocket.send(
        JSON.stringify({
          command: activate
            ? SensorsCommands.CONNECT
            : SensorsCommands.DISCONNECT,
          id: id,
        })
      );
    }
  };

  // Middleware logic
  // https://stackoverflow.com/questions/45339448/how-do-you-create-strongly-typed-redux-middleware-in-typescript-from-reduxs-typ
  // By reading the question (and others) I can argue it seems quite hard to change the Middleware type
  // For now just have action type to any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (next) => (action: any) => {
    switch (action.type) {
      case START_SENSOR_LISTENING:
        connectWebSocket();
        break;
      case CONNECT_SENSOR:
        if (websocket) {
          if (!action.payload) {
            // With no payload we connect all sensors
            for (const sensorId in store.getState().sensors.allIds) {
              setSensorConnection(true, sensorId);
            }
          } else {
            setSensorConnection(true, action.payload);
          }
        }
        break;
      case DISCONNECT_SENSOR:
        if (websocket) {
          if (!action.payload) {
            // With no payload we disconnect all sensors
            for (const sensorId in store.getState().sensors.allIds) {
              setSensorConnection(false, sensorId);
            }
          } else {
            setSensorConnection(false, action.payload);
          }
        }
        break;
      default:
        // Nothing
        break;
    }
    return next(action);
  };
};

// Define action creators for connecting and disconnecting sensors
export const connectSensor = (id: SensorID) => ({
  type: CONNECT_SENSOR,
  payload: id,
});
export const disconnectSensor = (id: SensorID) => ({
  type: DISCONNECT_SENSOR,
  payload: id,
});
export const disconnectAllSensors = () => ({ type: DISCONNECT_SENSOR });
export const connectAllSensors = () => ({ type: CONNECT_SENSOR });
export const startSensorListening = () => ({ type: START_SENSOR_LISTENING });
