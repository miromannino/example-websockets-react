import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  render,
  screen,
  waitFor,
  fireEvent,
  cleanup,
  act,
} from "@testing-library/react";
import App from "../src/App.tsx";

const wait = (time) => new Promise((resolve) => setTimeout(resolve, time));

const NUMBER_SENSORS = 6; // defined in server/index.js

describe("Sensor Values", () => {
  beforeEach(() => {
    render(<App />);
  });
  afterEach(() => cleanup());

  it("renders correctly display values", async () => {
    // Wait for all sensors to be there
    for (let i = 0; i < NUMBER_SENSORS; i++) {
      await waitFor(() =>
        expect(screen.getByTestId(`value-${i}`)).toBeInTheDocument()
      );
    }

    // Test that are all N/A
    for (let i = 0; i < NUMBER_SENSORS; i++) {
      const valueEl = await screen.findByTestId(`value-${i}`);
      expect(valueEl.textContent).toBe("N/A");
    }
  });

  it("renders correctly sensors after all are activated and deactivated", async () => {
    const buttonConnect = await screen.getByTestId("connect-all-button");
    await act(async () => {
      fireEvent.click(buttonConnect);
      await wait(2000);
    });

    // Test that are all numbers
    for (let i = 0; i < NUMBER_SENSORS; i++) {
      const valueEl = await screen.findByTestId(`value-${i}`);
      console.log(valueEl.textContent);
      expect(Number(valueEl.textContent)).not.toBeNaN();
    }

    // Disconnect all
    await act(async () => {
      fireEvent.click(buttonConnect);
      await wait(1000);
    });

    // Test that are all N/A
    for (let i = 0; i < NUMBER_SENSORS; i++) {
      const valueEl = await screen.findByTestId(`value-${i}`);
      expect(valueEl.textContent).toBe("N/A");
    }
  });

  it("renders correctly sensors after one is activated and deactivated", async () => {
    // Test that are all N/A
    for (let i = 0; i < NUMBER_SENSORS; i++) {
      const valueEl = await screen.findByTestId(`value-${i}`);
      expect(valueEl.textContent).toBe("N/A");
    }

    for (let sensorToTest = 0; sensorToTest < NUMBER_SENSORS; sensorToTest++) {
      // First we connect only that one sensor
      const buttonConnectDisconnect = await screen.getByTestId(
        `connect-disconnect-sensor-${sensorToTest}`
      );
      await act(async () => {
        fireEvent.click(buttonConnectDisconnect);
        await wait(1000);
      });

      // Check that all except sensorToTest are N/A
      for (let i = 0; i < NUMBER_SENSORS; i++) {
        const valueEl = await screen.findByTestId(`value-${i}`);
        if (i === sensorToTest) {
          expect(Number(valueEl.textContent)).not.toBeNaN();
        } else {
          expect(valueEl.textContent).toBe("N/A");
        }
      }

      // Disconnect again sensorToTest
      await act(async () => {
        fireEvent.click(buttonConnectDisconnect);
        await wait(1000);
      });

      // All are disconnected again
      for (let i = 0; i < NUMBER_SENSORS; i++) {
        const valueEl = await screen.findByTestId(`value-${i}`);
        expect(valueEl.textContent).toBe("N/A");
      }
    }
  });
});

// Tests can be even more extensive, this is just for the exercise...