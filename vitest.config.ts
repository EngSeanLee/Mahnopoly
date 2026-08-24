import { defineConfig } from "vitest/config";
import path from "path";

// Minimal config for testing plain server-side logic (Server Actions,
// lib functions) — no React/DOM rendering needed for what's tested here,
// so no jsdom environment or Next.js plugin required. Add those only if
// a future test actually needs to render a component.
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "node",
  },
});
