/* eslint-disable @typescript-eslint/no-unused-vars */
import { Session as PrismaSession } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email?: string | null;
      name?: string | null;
      role?: string;
      image?: string | null;
      sessionToken?: string;
      sessionData?: {
        browser?: string;
        browserVersion?: string;
        os?: string;
        osVersion?: string;
        deviceType?: string;
        deviceModel?: string;
        language?: string;
        browserId?: string;
        ipAddress?: string;
        city?: string;
        country?: string;
        latitude?: string;
        longitude?: string;
        lastActive?: Date;
      };
    };
    expires: string;
  }

  interface User {
    id: string;
    email?: string | null;
    name?: string | null;
    role?: string;
    image?: string | null;
    sessionData?: {
      browser?: string;
      browserVersion?: string;
      os?: string;
      osVersion?: string;
      deviceType?: string;
      deviceModel?: string;
      language?: string;
      browserId?: string;
      ipAddress?: string;
      city?: string;
      country?: string;
      latitude?: string;
      longitude?: string;
      lastActive?: Date;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
    email?: string | null;
    name?: string | null;
    iat?: number;
    exp?: number;
    jti?: string;
    sessionData?: {
      browser?: string;
      browserVersion?: string;
      os?: string;
      osVersion?: string;
      deviceType?: string;
      deviceModel?: string;
      language?: string;
      browserId?: string;
      ipAddress?: string;
      city?: string;
      country?: string;
      latitude?: string;
      longitude?: string;
      lastActive?: Date;
    };
  }
}