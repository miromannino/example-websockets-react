import React from "react";
import { useSelector } from "react-redux";
import { Typography, Box } from "@mui/material";
import { SensorID } from "../store/sensors";
import { RootState } from "../store/store";

interface SensorCardProps {
  sensorId: SensorID;
}

// This component displays the value of a sensor, or "N/A" if the sensor is not connected.
const SensorValue: React.FC<SensorCardProps> = ({ sensorId }) => {
  const data = useSelector((state: RootState) => state.sensors.byId[sensorId]);

  return (
    <Box>
      <Typography
        variant="h4"
        display="inline"
        data-testid={"value-" + sensorId}
        color={data.connected ? "info.main" : "text.disabled"}
      >
        {data.value}
      </Typography>
      &nbsp;
      <Typography variant="h6" display="inline">
        {data.unit}
      </Typography>
    </Box>
  );
};

export default SensorValue;
