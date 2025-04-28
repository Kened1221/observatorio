/* eslint-disable @typescript-eslint/no-explicit-any */
// auth.config.ts
import type { NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "@/config/prisma";

export const authConfig: NextAuthConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        browserId: { label: "Browser ID", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email y contraseña requeridos");
        }
        const email = credentials.email as string;
        const password = credentials.password as string;
        const browserId = credentials.browserId as string | undefined;

        const user = await prisma.user.findUnique({
          where: { email },
          include: { roles: true },
        });
        if (!user || !user.passwordHash) {
          throw new Error("Usuario no encontrado o sin contraseña");
        }
        const isValid = await compare(password, user.passwordHash);
        if (!isValid) throw new Error("Contraseña incorrecta");

        const roleName = user.roles[0]?.name ?? "user";
        return {
          id: user.id,
          email: user.email,
          name: user.name ?? null,
          role: roleName,
          browserId,
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user && account) {
        token.id = user.id;
        token.role = user.role ?? "user";
        const sessionToken = token.sub || crypto.randomUUID();
        token.sessionToken = sessionToken;

        const browserId = (user as any).browserId || crypto.randomUUID();

        console.log("jwt - Creating session: userId:", user.id, "sessionToken:", sessionToken, "browserId:", browserId);

        await prisma.session.upsert({
          where: { sessionToken },
          update: {
            userId: user.id,
            browserId,
            status: "active",
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            updatedAt: new Date(),
            deviceType: "Unknown",
            browser: "Unknown",
            os: "Unknown",
            city: "Unknown",
            country: "Unknown",
          },
          create: {
            sessionToken,
            userId: user.id,
            browserId,
            status: "active",
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            deviceType: "Unknown",
            browser: "Unknown",
            os: "Unknown",
            city: "Unknown",
            country: "Unknown",
          },
        });
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.sessionToken = token.sessionToken as string;
      }
      return session;
    },
    async signIn({ account, profile }) {
      if (account?.provider === "google" && profile?.email) {
        try {
          const user = await prisma.user.findUnique({
            where: { email: profile.email },
            include: { roles: true },
          });

          if (!user) {
            console.log("signIn: Usuario no encontrado", profile.email);
            return false;
          }

          const existingAccount = await prisma.account.findUnique({
            where: {
              provider_providerAccountId: {
                provider: account.provider,
                providerAccountId: account.providerAccountId,
              },
            },
          });

          if (!existingAccount && account) {
            await prisma.account.create({
              data: {
                userId: user.id,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                access_token: account.access_token,
                expires_at: account.expires_at,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
              },
            });
          }

          return true;
        } catch (error) {
          console.error("Error en signIn:", error);
          return false;
        }
      }
      return true;
    },
  },
  debug: process.env.NODE_ENV === "development",
};