import { auth } from "@/auth";

export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  console.log(session);


  if (session?.user.role !== "Admin") {
    return (
      <div className="flex flex-col gap-2 w-full h-full items-center justify-center">
        <h1 className="text-7xl font-bold">401</h1>
        <h1 className="text-2xl font-bold">Acceso denegado</h1>
        <p className="text-lg">No tienes permiso para acceder a esta página1.</p>
      </div>
    );
  }

  return (
    <>{children}</>
  );
}