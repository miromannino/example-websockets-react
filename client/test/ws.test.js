import { WebSocket } from "ws";
import { describe, it, expect, beforeEach, afterEach } from "vitest";

describe("WebSocket Server Tests", () => {
  let ws;

  beforeEach(() => {
    return new Promise((resolve, reject) => {
      ws = new WebSocket(import.meta.env.VITE_SERVER_WS_URL);

      ws.on("open", resolve); // Resolve the promise when the connection opens
      ws.on("error", reject); // Reject the promise on errors
    });
  });

  afterEach(() => {
    if (ws.readyState === WebSocket.OPEN) {
      return new Promise((resolve) => {
        ws.on("close", resolve);
        ws.close();
      });
    } else {
      // If the connection is not open, resolve immediately
      return Promise.resolve();
    }
  });

  it("should have all the fields described", async () => {
    await new Promise((resolve, reject) => {
      ws.on("message", (data) => {
        const message = JSON.parse(data);
        try {
          expect(message).toHaveProperty("id");
          expect(message).toHaveProperty("name");
          expect(message).toHaveProperty("connected");
          expect(message).toHaveProperty("unit");
          expect(message).toHaveProperty("value");
          resolve();
        } catch (error) {
          reject(error);
        }
      });

      ws.on("error", reject);
    });
  });

  it("all sensors at first are off, and null is returned as value", async () => {
    await new Promise((resolve, reject) => {
      ws.on("message", (data) => {
        const message = JSON.parse(data);
        try {
          expect(message.value).toBe(null);
          expect(message.connected).toBe(false);
          resolve();
        } catch (error) {
          reject(error);
        }
      });

      ws.on("error", reject);
    });
  });

  it("after connection the value shouldn't be null", async () => {
    ws.send(JSON.stringify({ command: "connect", id: "1" }));

    await new Promise((resolve, reject) => {
      ws.on("message", (data) => {
        const message = JSON.parse(data);
        try {
          if (message.id == "1" && message.connected) {
            expect(message.value).not.toBe(null);
            resolve();
          }
        } catch (error) {
          reject(error);
        }
      });

      ws.on("error", reject);
    });
  });

  // ... this is not exhaustive by any means just some for the sake of the exercise
});
