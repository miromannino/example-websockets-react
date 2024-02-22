import { spawn } from "child_process";
import { beforeAll, afterAll } from "vitest";
import "@testing-library/jest-dom";

let serverProcess;

async function startServer() {
  const pathToServerScript = "../server/index.js";
  serverProcess = spawn("node", [pathToServerScript], { stdio: "pipe" });

  return new Promise((resolve) => {
    console.log("Starting server...");
    serverProcess.stdout.on("data", (data) => {
      if (data.toString().includes("Server started")) {
        resolve(0);
      }
    });
  });
}

beforeAll(async () => {
  await startServer();
}, 3000);

afterAll(() => {
  if (serverProcess) {
    console.log("Stopping server...");
    serverProcess.kill();
  }
});
