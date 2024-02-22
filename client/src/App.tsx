import React from "react";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import useMediaQuery from "@mui/material/useMediaQuery";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { useEffect } from "react";
import { startSensorListening } from "./store/sensors/sensorsConnector";

function App() {

  // We have the interface to be dark or light mode depending on user system preference
  // Favico instead is automatically changing too with CSS inside the SVG
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? "dark" : "light",
        },
      }),
    [prefersDarkMode]
  );

  // We start the sensor listening. This automatically tries to re-connect
  // if the server goes down and it will recover the connect/disconnect status.
  // So this call is just a starting point for the listener that never stops.
  useEffect(() => {
    store.dispatch(startSensorListening());
  }, []);

  // Rendering the app
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Header />
        <Dashboard />
      </ThemeProvider>
    </Provider>
  );
}

export default App;
