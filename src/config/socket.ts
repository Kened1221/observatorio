// src/config/socket.ts
import { Server, Socket } from "socket.io";
import { prisma } from "@/config/prisma";

let io: Server | null = null;
let currentPort: number | null = null;

export function initializeSocketServer(port: number): void {
  if (io) {
    console.log(`Socket.IO server ya está corriendo en el puerto ${currentPort}`);
    return;
  }

  io = new Server(port, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  currentPort = port;

  io.use(async (socket: Socket, next) => {
    const { browserId, userId } = socket.handshake.query as {
      browserId?: string;
      userId?: string;
    };
    const token = socket.handshake.auth.token as string | undefined;

    if (!browserId || !userId || !token) {
      return next(new Error("Faltan browserId, userId o token"));
    }

    try {
      const session = await prisma.session.findFirst({
        where: {
          userId,
          browserId,
          sessionToken: token,
          status: "active",
          expires: { gt: new Date() },
        },
      });

      if (!session) {
        return next(new Error("Token de sesión inválido o expirado"));
      }

      next();
    } catch (error) {
      console.error("Error al validar token:", error);
      next(new Error("Error de autenticación"));
    }
  });

  io.on("connection", (socket) => {
    const { browserId, userId } = socket.handshake.query as {
      browserId: string;
      userId: string;
    };

    socket.join(`user:${userId}`);
    console.log(`Cliente conectado: browserId=${browserId}, userId=${userId}`);

    socket.on("closeSession", (data: { browserId: string }) => {
      console.log(`Evento closeSession recibido: browserId=${data.browserId}, userId=${userId}`);
      io?.to(`user:${userId}`).emit("sessionClosed", { browserId: data.browserId });
    });

    socket.on("disconnect", () => {
      console.log(`Cliente desconectado: browserId=${browserId}`);
    });

    socket.on("error", (error) => {
      console.error(`Error en Socket.IO para browserId=${browserId}:`, error);
    });
  });

  console.log(`Socket.IO Server escuchando en el puerto ${port}`);
}

export function notifySessionClosed(userId: string, browserId: string) {
  if (io) {
    io.to(`user:${userId}`).emit("sessionClosed", { browserId });
    console.log(`Notificación enviada a user:${userId} para cerrar browserId=${browserId}`);
  } else {
    console.error("Socket.IO server no está inicializado");
  }
}

export function getSocketPort(): number | null {
  return currentPort;
}

export { io };