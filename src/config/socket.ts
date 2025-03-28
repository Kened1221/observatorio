// src/config/socket.ts
import { Server, Socket } from "socket.io";
import { prisma } from "@/config/prisma";

const PORT = 8080;
const io = new Server(PORT, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Middleware para autenticar conexiones
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
    // Validar el sessionToken contra la base de datos
    const session = await prisma.session.findFirst({
      where: {
        userId,
        browserId,
        sessionToken: token,
        status: "active",
        expires: { gt: new Date() }, // Verificar que no haya expirado
      },
    });

    if (!session) {
      return next(new Error("Token de sesión inválido o expirado"));
    }

    // Si todo está bien, continuar con la conexión
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

  socket.on("disconnect", () => {
    console.log(`Cliente desconectado: browserId=${browserId}`);
  });

  socket.on("error", (error) => {
    console.error(`Error en Socket.IO para browserId=${browserId}:`, error);
  });
});

export function notifySessionClosed(userId: string, browserId: string) {
  io.to(`user:${userId}`).emit("sessionClosed", { browserId });
  console.log(`Notificación enviada a user:${userId} para cerrar browserId=${browserId}`);
}

console.log(`Socket.IO Server escuchando en el puerto ${PORT}`);

export { io };