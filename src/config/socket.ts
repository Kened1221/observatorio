// src/config/socket.ts
import { DefaultEventsMap, Server, Socket } from "socket.io";
import { prisma } from "@/config/prisma"; // Asegúrate que la ruta sea correcta


const PORT = Number(process.env.SOCKET_PORT) || 8080;

// --- Inicio: Lógica Singleton ---

// Ampliamos el tipo global de NodeJS para declarar nuestra variable personalizada
// Esto ayuda con TypeScript para reconocer 'global.io'.
declare global {
  // eslint-disable-next-line no-var
  var io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown> | undefined;
}

let io: Server;

// Comprobamos si ya existe una instancia en la variable global.
// 'global' es un objeto global en Node.js que persiste durante la vida del proceso.
if (!global.io) {
  console.log(">>> Inicializando NUEVO servidor Socket.IO...");

  // Creamos la instancia del servidor Socket.IO.
  // new Server(PORT, ...) crea implícitamente un servidor HTTP en ese puerto.
  io = new Server(PORT, {
    cors: {
      origin: process.env.SOCKET_ORIGIN, // ¡RESTRINGE ESTO EN PRODUCCIÓN a tu dominio frontend!
      methods: ["GET", "POST"],
    },
  });

  // ==================================================================
  //  IMPORTANTE: Adjunta TODO (middleware, listeners) UNA SOLA VEZ
  // ==================================================================

  // Middleware para autenticar conexiones
  io.use(async (socket: Socket, next) => {
    const { browserId, userId } = socket.handshake.query as {
      browserId?: string;
      userId?: string;
    };
    const token = socket.handshake.auth.token as string | undefined;

    // Imprime para depuración (puedes quitarlo después)
    console.log(`[Socket Middleware] Intento Conexión: UserID=${userId}, BrowserID=${browserId}, Token=${token ? 'Presente' : 'Ausente'}`);


    if (!browserId || !userId || !token) {
      console.error("[Socket Middleware] Rechazado: Faltan browserId, userId o token");
      return next(new Error("Faltan browserId, userId o token"));
    }

    try {
      // Validar el sessionToken contra la base de datos
      const session = await prisma.session.findFirst({
        where: {
          userId,
          // Quita browserId de aquí si el token ya lo identifica unívocamente
          // browserId,
          sessionToken: token,
          status: "active",
          expires: { gt: new Date() }, // Verificar que no haya expirado
        },
      });

      if (!session) {
        console.warn(`[Socket Middleware] Rechazado: Token (${token.substring(0, 5)}...) inválido/expirado para UserID=${userId}`);
        return next(new Error("Token de sesión inválido o expirado"));
      }

      // Guarda info útil en el socket para fácil acceso posterior
      socket.data.userId = userId;
      socket.data.browserId = browserId;
      socket.data.sessionToken = token;

      console.log(`[Socket Middleware] Conexión Aceptada: UserID=${userId}, BrowserID=${browserId}`);
      // Si todo está bien, continuar con la conexión
      next();
    } catch (error) {
      console.error("[Socket Middleware] Error al validar token:", error);
      next(new Error("Error de autenticación"));
    }
  });

  // Listener de Conexión Principal
  io.on("connection", (socket) => {
    // Accedemos a los datos guardados en el middleware
    const { userId, browserId } = socket.data;

    socket.join(`user:${userId}`);
    console.log(`[Socket Connect] Cliente Conectado: UserID=${userId}, BrowserID=${browserId}, SocketID=${socket.id}`);

    socket.on("disconnect", (reason) => {
      console.log(`[Socket Disconnect] Cliente Desconectado: UserID=${userId}, BrowserID=${browserId}, SocketID=${socket.id}, Razón: ${reason}`);
    });

    socket.on("error", (error) => {
      console.error(`[Socket Error] Error para UserID=${userId}, BrowserID=${browserId}, SocketID=${socket.id}:`, error);
    });

    // Aquí puedes añadir otros listeners para eventos personalizados
    // ej: socket.on('sendMessage', (data) => { /* ... */ });
  });

  // Guardamos la instancia recién creada en la variable global
  global.io = io;
  console.log(`<<< Servidor Socket.IO iniciado y escuchando en el puerto ${PORT} >>>`);

} else {
  console.log("--- Reutilizando instancia existente del servidor Socket.IO ---");
  // Si ya existe una instancia global, simplemente la reutilizamos.
  io = global.io;
}

// --- Fin: Lógica Singleton ---


// Función para notificar (ahora usa la instancia 'io' del scope del módulo)
export function notifySessionClosed(
  userId: string,
  browserId: string,
  additionalInfo?: {
    reason?: string;
    timestamp?: Date;
    // Podrías pasar el sessionToken si el cliente lo necesita identificar
    // sessionToken?: string;
  }
) {
  // Verificación por si acaso (aunque con el singleton, 'io' debería estar definido)
  if (!io) {
    console.error("¡Error Crítico! La instancia del servidor Socket.IO no está disponible para notificar.");
    return;
  }
  try {
    const payload = {
      browserId,
      ...additionalInfo,
      timestamp: additionalInfo?.timestamp || new Date(),
    };
    io.to(`user:${userId}`).emit("sessionClosed", payload);

    console.log(
      `[Socket Notify] Notificación enviada a user:${userId} para cerrar browserId=${browserId}. Payload:`, payload
    );
  } catch (error) {
    console.error("[Socket Notify] Error al notificar cierre de sesión:", error);
  }
}


// Exportamos la instancia (con precaución) y la función de notificación
// Normalmente sólo necesitas exportar funciones como `notifySessionClosed`.
export { io };