import React from "react";
import { useSelector } from "react-redux";
import { IconButton, Icon, Card, CardHeader, CardContent } from "@mui/material";
import { SensorID } from "../store/sensors";
import { store, RootState } from "../store/store";
import {
  connectSensor,
  disconnectSensor,
} from "../store/sensors/sensorsConnector";
import SensorValue from "./SensorValue";

interface SensorCardProps {
  sensorId: SensorID;
}

// This component displays a sensor card, with the sensor name, a connect/disconnect button
const SensorDisplay: React.FC<SensorCardProps> = React.memo(({ sensorId }) => {
  // We use the sensorId to get the sensor name and connection status from the store
  // Separately so we don't get re-renders when it changes the whole sensor data
  const name = useSelector(
    (state: RootState) => state.sensors.byId[sensorId].name
  );
  const connected = useSelector(
    (state: RootState) => state.sensors.byId[sensorId].connected
  );

  const connect = () => {
    store.dispatch(connectSensor(sensorId));
  };

  const disconnect = () => {
    store.dispatch(disconnectSensor(sensorId));
  };

  return (
    <Card>
      <CardHeader
        title={name}
        action={
          <IconButton
            onClick={() => (connected ? disconnect() : connect())}
            data-testid={`connect-disconnect-sensor-${sensorId}`}
            title={connected ? "Disconnect" : "Connect"}
          >
            {connected ? <Icon>sensors</Icon> : <Icon>sensors_off</Icon>}
          </IconButton>
        }
      />
      <CardContent>
        <SensorValue sensorId={sensorId} />
      </CardContent>
    </Card>
  );
});

export default SensorDisplay;
