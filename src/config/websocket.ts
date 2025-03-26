// src/config/websocket.ts
import { WebSocketServer, WebSocket } from "ws";

const PORT = 8080; // Ajusta según el puerto que uses
let wss: WebSocketServer | undefined;
const clients = new Map<string, WebSocket>();

try {
  wss = new WebSocketServer({ port: PORT });
  console.log(`WebSocket Server escuchando en el puerto ${PORT}`);

  wss.on("connection", (ws: WebSocket, req) => {
    const urlParams = new URLSearchParams(req.url?.split("?")[1]);
    const browserId = urlParams.get("browserId");

    if (browserId) {
      clients.set(browserId, ws);
      console.log(`Cliente conectado con browserId: ${browserId}`);

      ws.on("close", () => {
        clients.delete(browserId);
        console.log(`Cliente desconectado con browserId: ${browserId}`);
      });

      ws.on("error", (error) => {
        console.error(`Error en WebSocket para browserId ${browserId}:`, error);
        clients.delete(browserId);
      });
    }
  });

  wss.on("error", (error) => {
    console.error("Error en WebSocket Server:", error);
  });
} catch (error) {
  console.error(`No se pudo iniciar el servidor WebSocket en el puerto ${PORT}:`, error);
  process.exit(1);
}

export function notifySessionClosed(browserId: string) {
  const client = clients.get(browserId);
  if (client && client.readyState === WebSocket.OPEN) {
    client.send(JSON.stringify({ action: "sessionClosed", browserId }));
  }
}

process.on("SIGINT", () => {
  wss?.close();
  console.log("WebSocket Server cerrado");
  process.exit(0);
});