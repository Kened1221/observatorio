import { auth } from '@/auth';

export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (session?.user.role !== 'Admin') {
    return (
      <div className="flex flex-col justify-center items-center gap-2 w-full h-full">
        <h1 className="font-bold text-7xl">401</h1>
        <h1 className="font-bold text-2xl">Acceso denegado</h1>
        <p className="text-lg">No tienes permiso para acceder a esta página.</p>
      </div>
    );
  }

  return <>{children}</>;
}
