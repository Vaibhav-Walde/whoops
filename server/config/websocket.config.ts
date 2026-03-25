import { WebSocketServer } from "ws";
import { setupWSConnection } from "y-websocket/bin/utils";
import { Server } from "http";
import logger from "../config/logger.config";

const initWebSocketServer = (server: Server) => {
  const wss = new WebSocketServer({ server });

  wss.on("connection", (conn, req) => {
    const { pathname } = new URL(req.url!, "http://localhost");
    const docId = pathname.split("/").filter(Boolean).pop() ?? "default";

    logger.debug(`New connection — docId: ${docId}`);
    logger.debug(`Total clients after connect: ${wss.clients.size}`);

    conn.on("close", () => {
      logger.debug(`Client disconnected — docId: ${docId}`);
      logger.debug(`Total clients after disconnect: ${wss.clients.size}`);
    });

    setupWSConnection(conn, req, { docName: docId });
  });
};

export default initWebSocketServer;
