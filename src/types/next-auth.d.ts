import { Session as PrismaSession } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email?: string;
      name?: string | null;
      role?: string;
      image?: string;
      sessions?: PrismaSession[];
    };
  }

  interface User {
    id: string;
    email?: string;
    name?: string | null;
    role?: string;
    image?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
  }
}