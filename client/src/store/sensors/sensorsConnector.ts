import { Middleware, Action } from "@reduxjs/toolkit";
import { SensorData, SensorID, SensorsCommands, updateSensorData } from ".";

// These are action types for the sensors connector
enum ActionTypes {
  START_SENSOR_LISTENING = "sensors/startListening",
  CONNECT_SENSOR = "sensors/connectSensor",
  DISCONNECT_SENSOR = "sensors/disconnectSensor",
}

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

    if (!import.meta.env.VITE_SERVER_WS_URL) {
      throw new Error("VITE_SERVER_WS_URL is not defined");
    }
    websocket = new WebSocket(import.meta.env.VITE_SERVER_WS_URL);

    // On open
    websocket.onopen = () => {
      console.log("Connected to the server");

      // If there are sensors connection status to recover, we do
      if (Object.keys(connectionStatusRecovery).length > 0) {
        for (const sensorId in connectionStatusRecovery) {
          setSensorConnection(connectionStatusRecovery[sensorId], sensorId);
        }
        connectionStatusRecovery = {};
      }
    };

    // Parse incoming sensor data and update state via dispatch
    websocket.onmessage = (event) => {
      // Parse incoming sensor data and update state via dispatch
      let sensorData: SensorData;
      try {
        sensorData = JSON.parse(event.data);
      } catch (error) {
        console.error("Error parsing sensor data:", error);
        return;
      }
      store.dispatch(updateSensorData(sensorData));
    };

    // Log errors and re-connect on error
    websocket.onerror = (error) => {
      console.error("WebSocket encountered an error:", error);
      if (websocket) {
        websocket.close(); // Ensure the socket is closed before attempting to reconnect
      }
    };

    // Reconnect on close
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
      }, 500);
    };
  };

  const setSensorConnection = (activate: boolean, id: SensorID) => {
    if (websocket) {
      console.log("Sending connect to " + id);
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
      case ActionTypes.START_SENSOR_LISTENING:
        connectWebSocket();
        break;
      case ActionTypes.CONNECT_SENSOR:
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
      case ActionTypes.DISCONNECT_SENSOR:
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
  type: ActionTypes.CONNECT_SENSOR,
  payload: id,
});
export const disconnectSensor = (id: SensorID) => ({
  type: ActionTypes.DISCONNECT_SENSOR,
  payload: id,
});
export const disconnectAllSensors = () => ({
  type: ActionTypes.DISCONNECT_SENSOR,
});
export const connectAllSensors = () => ({ type: ActionTypes.CONNECT_SENSOR });
export const startSensorListening = () => ({
  type: ActionTypes.START_SENSOR_LISTENING,
});
