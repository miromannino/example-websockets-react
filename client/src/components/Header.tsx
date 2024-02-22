import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  FormControlLabel,
  Switch,
} from "@mui/material";
// import Logo from "../assets/logo.svg?react"; // TODO this create issues with Vitest tests
import Icon from "@mui/material/Icon";
import {
  connectAllSensors,
  disconnectAllSensors,
} from "../store/sensors/sensorsConnector";
import { setShowDisconnected } from "../store/sensors";
import { useSelector } from "react-redux";
import { store, RootState } from "../store/store";
import { getShowDisconnected } from "../store/sensors/selectors";

// This component displays the header of the app, with the logo, title
// and connect/disconnect all button, and show disconnected switch
const Header = () => {
  const allConnected = useSelector((state: RootState) =>
    state.sensors.allIds.every((id) => state.sensors.byId[id].connected)
  );
  const showDisconnected = useSelector(getShowDisconnected);

  return (
    <AppBar position="static">
      <Toolbar>
        {/* <SvgIcon component={Logo} sx={{ marginRight: 2 }} inheritViewBox /> */}
        <Box
          component="img"
          src="/logo.svg"
          sx={{ height: "1.5em", width: "1.5em", marginRight: "0.5em" }}
        />
        <Typography variant="h6" sx={{ flexGrow: 1, whiteSpace: "nowrap" }}>
          Sensors Dashboard
        </Typography>

        <FormControlLabel
          control={
            <Switch
              checked={showDisconnected}
              onChange={() =>
                store.dispatch(setShowDisconnected(!showDisconnected))
              }
            />
          }
          label="Show disconnected"
        />

        <Button
          variant="outlined"
          startIcon={
            allConnected ? <Icon>sensors_off</Icon> : <Icon>sensors</Icon>
          }
          data-testid="connect-all-button"
          onClick={() =>
            store.dispatch(
              allConnected ? disconnectAllSensors() : connectAllSensors()
            )
          }
        >
          {allConnected ? "Disconnect all" : "Connect all"}
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
