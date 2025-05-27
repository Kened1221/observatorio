import { ProtectModule } from '@/actions/auth';
import { auth } from '@/auth';

export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  const centinela = await ProtectModule(session!, "politica_incluir");
  if (!centinela) {
    return (
      <div className="flex flex-col justify-center items-center gap-4 w-full min-h-screen p-4">
        <h1 className="font-bold text-5xl sm:text-7xl text-red-600">401</h1>
        <h2 className="font-bold text-xl sm:text-2xl">Acceso denegado</h2>
        <p className="text-base sm:text-lg text-center max-w-md">
          No tienes permiso para acceder a esta página.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}