import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const sourceDirectories = [
  "assets",
  "components",
  "constants",
  "hooks",
  "layouts",
  "pages",
  "providers",
  "routes",
  "services",
  "theme",
  "types",
  "utils",
];

export default defineConfig(({ mode }) => ({
  base: mode === "production" ? "/sepan/" : "/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: Object.fromEntries(
      sourceDirectories.map((directory) => [
        directory === "types" ? "@appTypes" : `@${directory}`,
        fileURLToPath(new URL(`./src/${directory}`, import.meta.url)),
      ]),
    ),
  },
  // react-secure-storage reads these optional browser settings through process.env.
  define: { "process.env": {} },
  build: {
    target: ["chrome111", "safari16.4", "firefox128"],
    outDir: "dist",
    emptyOutDir: true,
    rolldownOptions: {
      output: {
        // Ionic's generated components share circular runtime imports across chunks.
        strictExecutionOrder: true,
        codeSplitting: {
          groups: [
            { name: "ionic", test: /node_modules\/@ionic\//, maxSize: 250_000 },
            {
              name: "charts",
              test: /node_modules\/(recharts|victory|d3-)/,
              maxSize: 250_000,
            },
            {
              name: "react",
              test: /node_modules\/(react|react-dom|scheduler)\//,
              maxSize: 250_000,
            },
          ],
        },
      },
    },
  },
}));
