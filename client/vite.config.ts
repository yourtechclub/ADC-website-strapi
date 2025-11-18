import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    tailwindcss(), 
    reactRouter(), 
    tsconfigPaths(),
    {
      name: 'configure-server',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          // Allow the app to be embedded in Strapi's preview iframe
          res.setHeader('Content-Security-Policy', "frame-ancestors 'self' http://localhost:1337");
          next();
        });
      },
    },
  ],
  server: {
    port: 5174,
    host: true,
    strictPort: true,
  },
});
