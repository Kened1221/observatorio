// src/auth.config.ts
import type { NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

export default {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  callbacks: {
    async authorized({ auth }) {
      return !!auth;
    },
    async session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
} satisfies NextAuthConfig;

