// src/auth.ts
import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

// Crea una instancia de NextAuth con la configuración
export const { auth, signIn, signOut, handlers } = NextAuth(authConfig);