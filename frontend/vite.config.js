import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // eslint-disable-next-line no-undef
  const env = loadEnv(mode, process.cwd(), "");
  return {
    server: {
      proxy: {
        "/api": {
          target: env.VITE_ENDPOINT,
          secure: false,
        },
      },
    },
    plugins: [react()],
  };
});
