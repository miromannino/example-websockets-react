import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SensorData, SensorsState } from ".";

// I choose this approach of normalizing the data following
// https://redux.js.org/usage/structuring-reducers/normalizing-state-shape
// In this way when data is updated for one sensor the list of available
// sensors will not be affected, and vice versa.
// By checking with the DevTools you can see only what's needed is re-rendered.
const initialState: SensorsState = {
  byId: {},
  allIds: [],
  showDisconnected: true
};

// Create a slice for the sensors data
export const sensorsSlice = createSlice({
  name: "sensors",
  initialState,
  reducers: {
    updateSensorData(state, action: PayloadAction<SensorData>) {
      const sensorData = action.payload;

      // Add new sensor if it's not present
      if (!state.allIds.includes(sensorData.id)) {
        state.allIds.push(sensorData.id);
      }

      // Update or add the sensor data in the byId object
      state.byId[sensorData.id] = sensorData;
    },
    setShowDisconnected(state, action: PayloadAction<boolean>) {
      state.showDisconnected = action.payload;
    }
  },
});

