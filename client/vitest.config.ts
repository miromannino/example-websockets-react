/// <reference types="vitest" />
import { defineConfig } from "vite";

export default defineConfig({
  test: {
    setupFiles: ["./test/testSetup.ts"],
    environment: "jsdom",
    globals: true,
  },
});
