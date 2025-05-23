import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import authConfig from "./auth.config";
import bcrypt from "bcryptjs";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";
import { User } from "next-auth";
import { AdapterUser } from "@auth/core/adapters";
import { Account, Profile } from "next-auth";
import { prisma } from "./config/prisma";

const { providers, ...restConfig } = authConfig;
const credentialsProvider = providers.find(
  (provider) => provider.id === "credentials"
);

if (credentialsProvider && "authorize" in credentialsProvider) {
  credentialsProvider.authorize = async (credentials) => {
    if (!credentials?.email || !credentials?.password) {
      console.log("Missing credentials");
      return null;
    }

    const { email, password } = credentials as {
      email: string;
      password: string;
    };

    try {
      const user = await prisma.user.findUnique({
        where: { email },
        include: {
          role: {
            select: { name: true },
          },
        },
      });

      if (!user || !user.passwordHash) {
        console.log("User or password incorrect");
        return null;
      }

      if (user.active !== 1) {
        console.log("User is inactive");
        return null;
      }

      const isValid = await bcrypt.compare(password, user.passwordHash);

      if (!isValid) {
        console.log("User or password incorrect");
        return null;
      }

      const userData = {
        id: user.id.toString(),
        email: user.email,
        name: user.name,
        role: user.role?.name ?? "user",
      };
      return userData;
    } catch (error) {
      console.error("Error en authorize:", error);
      return null;
    }
  };
}

const callbacks = {
  ...restConfig.callbacks,
  session: async ({ session, token }: { session: Session; token: JWT }) => {
    if (session.user) {
      session.user.id = token.id as string;
      session.user.role = token.role ?? "user";
      session.user.email = token.email;
      session.user.name = token.name;
      session.user.sessionData = token.sessionData;
    }

    return session;
  },
  jwt: async ({ token, user }: { token: JWT; user?: User | AdapterUser }) => {
    if (user) {
      token.id = user.id;
      token.role = user.role;
      token.email = user.email;
      token.name = user.name;
      token.sessionData = user.sessionData;
    }

    return token;
  },
  signIn: async (params: {
    user: User | AdapterUser;
    account?: Account | null;
    profile?: Profile;
    email?: { verificationRequest?: boolean };
    credentials?: Record<string, unknown>;
  }) => {
    const { user, account } = params;
    // Asegurarse de que account no sea undefined
    if (account === undefined || account === null) {
      console.error("Account no definido durante el inicio de sesión");
      return "/auth/error?error=AccessDenied&message=Datos de cuenta incompletos";
    }
    // Verificar que user.id esté definido
    if (!user.id || !user.email) {
      console.error("No se encontró ID o email durante el inicio de sesión");
      return "/auth/error?error=AccessDenied&message=Datos de usuario incompletos";
    }

    try {
      // Si es un proveedor OAuth (Google)
      if (account?.provider === "google") {
        // Buscar si existe el usuario con ese email
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
          include: {
            accounts: true,
            role: {
              select: { name: true },
            },
          },
        });

        // Si no existe el usuario y tu política es rechazar nuevos registros
        if (!existingUser) {
          return "/auth/error?error=AccessDenied&message=Email no registrado";
        }

        // Asignar el rol al usuario
        if (existingUser.role) {
          user.role = existingUser.role.name;
        }

        // Si el usuario existe pero no tiene una cuenta vinculada con Google
        if (!existingUser.accounts.some((acc) => acc.provider === "google")) {
          // Crear un enlace entre la cuenta existente y Google
          await prisma.account.create({
            data: {
              userId: existingUser.id,
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

        // Usar el ID del usuario existente
        user.id = existingUser.id;
      }

      return true;
    } catch (error) {
      console.error("Error en signIn:", error);
      return "/auth/error?error=ServerError&message=Error del servidor";
    }
  },
};

// Exportar con un event handler personalizado para signOut
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt", maxAge: 2 * 24 * 60 * 60 },
  ...restConfig,
  providers,
  callbacks,
});
