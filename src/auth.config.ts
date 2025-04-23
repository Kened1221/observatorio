// auth.config.ts
import type { NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

// Validar variables de entorno
const validateEnv = () => {
  const requiredEnv = [
    { name: "GOOGLE_CLIENT_ID", value: process.env.GOOGLE_CLIENT_ID },
    { name: "GOOGLE_CLIENT_SECRET", value: process.env.GOOGLE_CLIENT_SECRET },
  ];
  for (const env of requiredEnv) {
    if (!env.value) throw new Error(`${env.name} no definido`);
  }
};
validateEnv();

const prisma = new PrismaClient();

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
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email y contraseña requeridos");
        }
        const email = credentials.email as string;
        const password = credentials.password as string;

        try {
          const user = await prisma.user.findUnique({
            where: { email },
            include: { roles: true },
          });
          if (!user || !user.passwordHash) {
            throw new Error("Usuario no encontrado o sin contraseña");
          }
          const isValid = await bcrypt.compare(password, user.passwordHash);
          if (!isValid) throw new Error("Contraseña incorrecta");

          const roleName = user.roles[0]?.name ?? "user";
          return {
            id: user.id,
            email: user.email,
            name: user.name ?? null,
            role: roleName,
          };
        } catch (error) {
          console.error("Error en authorize:", error);
          throw new Error("Error de autenticación");
        }
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
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role ?? "user";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
    async signIn({ account, profile }) {
      if (account?.provider === "google" && profile?.email) {
        try {
          console.log("signIn: Procesando Google login", { email: profile.email });

          // Buscar usuario por email
          const user = await prisma.user.findUnique({
            where: { email: profile.email },
            include: { roles: true },
          });

          if (!user) {
            console.log("signIn: Usuario no encontrado", profile.email);
            return false; // No crear usuario, ya que esperas que esté registrado
          }

          // Verificar o crear cuenta OAuth
          const existingAccount = await prisma.account.findUnique({
            where: {
              provider_providerAccountId: {
                provider: account.provider,
                providerAccountId: account.providerAccountId,
              },
            },
          });

          if (!existingAccount && account) {
            console.log("signIn: Vinculando cuenta Google para usuario", user.id);
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

          console.log("signIn: Inicio de sesión exitoso para", profile.email);
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