import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "https://socialsnapdef-api.vercel.app",
        secure: false,
      },
    },
  },
  plugins: [react()],
});
