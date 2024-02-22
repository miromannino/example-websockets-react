import { createSelector } from "reselect";
import { RootState } from "../store";
import { SensorID } from ".";

export const getAllIds = (state: RootState) => state.sensors.allIds;
export const getById = (state: RootState) => state.sensors.byId;
export const getShowDisconnected = (state: RootState) => state.sensors.showDisconnected;

export const getVisibleSensorsIds = createSelector(
  [getAllIds, getById, getShowDisconnected],
  (allIds, byId, showDisconnected) => {
    return showDisconnected
      ? allIds
      : allIds.filter((id: SensorID) => byId[id].connected);
  }
);
