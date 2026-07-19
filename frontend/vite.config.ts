import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    watch: {
      // Prevents Vite from watching thousands of dynamic Rust build files
      ignored: ["**/src-tauri/target/**"]
    }
  },
  build: {
    sourcemap: false,   // Keeps massive developer debugging maps out of your compiled frontend bundle
    minify: 'esbuild'   // Uses high-speed, structural compression to shrink asset footprints
  }
})