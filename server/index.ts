  import express from "express";
  import cors from "cors";
  import logger from "./config/logger.config";
  import http from "http";
  import { ALLOWED_ORIGINS, PORT } from "./config/constants.config";
  import loggerMiddleware from "./middleware/logger.middleware";
  import apiRoutes from "./routes/api.route";
  import errorHandlerMiddleware from "./middleware/error.middleware";
  import initWebSocketServer from "./config/websocket.config";
  import cron from "node-cron";
  import documentVersionCleanupWorker from "./worker/versionCleanup.worker";

  const app = express();

  app.use(
    cors({
      origin: ALLOWED_ORIGINS.filter((origin): origin is string => origin !== undefined),
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );
  app.use(express.json());

  app.use(loggerMiddleware);
  app.use("/api/v1", apiRoutes);
  app.use(errorHandlerMiddleware);

  app.get("/health", (_req, res) => {
    return res.status(200).json({ status: "ok" });
  });
  app.get("/debug", (_req, res) => {
    return res.status(200).json({ 
      allowed_origins: process.env.ALLOWED_ORIGINS,
      node_env: process.env.NODE_ENV,
      resend_key: process.env.RESEND_API_KEY?.slice(0, 10)
    });
  });

  cron.schedule(
    "0 */12 * * *",
    async () => {
      await documentVersionCleanupWorker();
    },
    {
      timezone: "Asia/Kolkata",
    }
  );

  const server = http.createServer(app);
  initWebSocketServer(server);

  server.listen(PORT, () => {
    logger.success(`Server is running on PORT ${PORT}`);
  });
