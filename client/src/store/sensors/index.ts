import { sensorsSlice } from "./sensorsSlice";

// --------------------------------------------------
// Sensors Types
// --------------------------------------------------
export type SensorID = string;

export interface SensorData {
  id: SensorID;
  name: string;
  connected: boolean;
  unit: string;
  value: number;
}

// --------------------------------------------------
// State
// --------------------------------------------------
export interface SensorsState {
  byId: { [key: string]: SensorData };
  allIds: string[];
  showDisconnected: boolean;
}

// Export the reducer and action creators
export const sensorsReducer = sensorsSlice.reducer;
export const { updateSensorData, setShowDisconnected } = sensorsSlice.actions;
