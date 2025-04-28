// src/server.ts
import { initializeSocketServer, io } from "./config/socket";

const BASE_PORT = 8080;
const MAX_PORT_ATTEMPTS = 10;

async function startServer(port: number, attempts: number = 0): Promise<void> {
  if (attempts >= MAX_PORT_ATTEMPTS) {
    console.error(`No se pudo iniciar Socket.IO tras ${MAX_PORT_ATTEMPTS} intentos`);
    process.exit(1);
  }

  try {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Retraso para evitar condiciones de carrera
    initializeSocketServer(port);
    console.log(`Socket.IO iniciado correctamente en el puerto ${port}`);
  } catch (error: unknown) {
    const err = error as NodeJS.ErrnoException;
    if (err.code === "EADDRINUSE") {
      console.warn(`Puerto ${port} en uso, intentando puerto ${port + 1}...`);
      await startServer(port + 1, attempts + 1);
    } else {
      console.error("Error al iniciar el servidor:", err);
      process.exit(1);
    }
  }
}

startServer(BASE_PORT).catch(err => {
  console.error("Error crítico al iniciar el servidor:", err);
  process.exit(1);
});

process.on("SIGINT", () => {
  if (io) {
    io.close(() => {
      console.log("Socket.IO server cerrado");
      process.exit(0);
    });
  } else {
    console.log("Socket.IO server no está inicializado, cerrando proceso");
    process.exit(0);
  }
});