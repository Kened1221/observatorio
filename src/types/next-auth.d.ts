// next-auth.d.ts actualizado
import { Session as PrismaSession } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email?: string;
      name?: string;
      role?: string;
      image?: string;
      sessions?: PrismaSession[];
      sessionToken?: string;
    };
  }

  // Extender el tipo User para incluir role
  interface User {
    id: string;
    email?: string;
    name?: string;
    image?: string;
    role?: string;
    sessionToken?: string;
  }
}

// Extender JWT para incluir role
declare module "next-auth/jwt" {
  interface JWT {
    sub?: string;
    role?: string;
    sessionToken?: string;
  }
}