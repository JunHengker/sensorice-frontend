import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import generouted from "@generouted/react-router/plugin";
import { fileURLToPath } from "url";

// ESM-compatible __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react(), generouted()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
