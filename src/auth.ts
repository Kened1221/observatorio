// auth.ts
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
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
    const { email, password } = credentials as {
      email: string;
      password: string;
    };
    if (!email || !password) return null;

    try {
      const user = await prisma.user.findUnique({ 
        where: { email },
        include: { roles: {
          select: { name: true }
        } },
      });

      if (!user || !user.passwordHash) return null;

      const isValid = await bcrypt.compare(password, user.passwordHash);
      if (!isValid) return null;

      // Retornamos un objeto que corresponde con el tipo User extendido
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        role: user.roles[0]?.name, // Usar optional chaining
      };
    } catch (error) {
      console.error("Error en authorize:", error);
      return null;
    }
  };
}

const callbacks = {
  ...restConfig.callbacks,
  session: async ({ session, token }: { session: Session; token: JWT }) => {
    if (token.sub) {
      session.user.id = token.sub;
      session.user.role = token.role;
      session.user.sessionToken = token.sessionToken;

      try {
        const sessions = await prisma.session.findMany({
          where: { userId: token.sub },
        });
        session.user.sessions = sessions;
      } catch (error) {
        console.error("Error al buscar sesiones:", error);
      }
    }
    return session;
  },
  jwt: async ({
    token,
    user,
    account,
  }: {
    token: JWT;
    user?: User | AdapterUser;
    account?: Account | null;
    profile?: Profile;
  }) => {
    if (user && user.id) {
      token.sub = user.id;
      if ((user as User & { role?: string }).role) {
        token.role = (user as User & { role?: string }).role;
      } else if (account) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            include: { roles: { select: { name: true } } },
          });
          if (dbUser && dbUser.roles && dbUser.roles.length > 0) {
            token.role = dbUser.roles[0].name;
            (user as User & { role?: string }).role = dbUser.roles[0].name;
          }
        } catch (error) {
          console.error("Error al obtener rol del usuario:", error);
        }
      }
    }
    return token;
  },
  signIn: async (params: { 
    user: User | AdapterUser; 
    account: Account | null;
    profile?: Profile;
    email?: { verificationRequest?: boolean };
    credentials?: Record<string, unknown>;
  }) => {
    const { user, account } = params;
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
            roles: {
              select: { name: true }
            }
          },
        });

        // Si no existe el usuario y tu política es rechazar nuevos registros
        if (!existingUser) {
          return "/auth/error?error=AccessDenied&message=Email no registrado";
        }

        // Asignar el rol al usuario
        if (existingUser.roles && existingUser.roles.length > 0) {
          (user as User & { role?: string }).role = existingUser.roles[0].name;
        }

        // Si el usuario existe pero no tiene una cuenta vinculada con Google
        if (!existingUser.accounts.some(acc => acc.provider === "google")) {
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