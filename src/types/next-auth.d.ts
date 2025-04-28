// types/next-auth.d.ts
import { Session as PrismaSession } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    sessionToken?: string; // Add sessionToken
    user: {
      id: string;
      email?: string | null;
      name?: string | null;
      role?: string;
      image?: string | null;
      sessions?: PrismaSession[];
    };
  }

  interface User {
    id: string;
    email?: string | null;
    name?: string | null;
    role?: string;
    image?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
  }
}