import { Container, Grid } from "@mui/material";
import { useSelector } from "react-redux";
import SensorDisplay from "./SensorDisplay";
import { getVisibleSensorsIds } from "../store/sensors/selectors";

// This component displays the dashboard, with all the sensors
const Dashboard = () => {
  const displayIDs = useSelector(getVisibleSensorsIds);

  return (
    <Container data-testid="dashboard">
      <Grid container spacing={2} padding={2}>
        {displayIDs.map((id) => (
          <Grid key={id} xs={12} sm={6} md={3} item>
            <SensorDisplay sensorId={id} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Dashboard;
