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

// --------------------------------------------------
// Commands
// --------------------------------------------------

// These are the commands that can be sent via websocket to the sensors
export enum SensorsCommands {
  CONNECT = "connect",
  DISCONNECT = "disconnect",
}

export interface SensorCommand {
  command: SensorsCommands;
  id: SensorID;
}

interface SensorAction extends Action {
  type: ActionTypes;
  payload?: SensorID | null;
}