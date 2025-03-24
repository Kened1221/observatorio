/* eslint-disable @next/next/no-img-element */
// components/account/Profile.tsx
import { User, Mail, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProfileProps {
  userData: {
    name: string;
    email: string;
    avatar: string | null;
    isGoogleLinked: boolean;
  };
}

const Profile = ({ userData }: ProfileProps) => {
  return (
    <div className="px-4 py-5 sm:p-6">
      <h2 className="text-lg font-medium text-primary-foreground">Información del Perfil</h2>
      <div className="mt-5 flex flex-col sm:flex-row">
        <div className="sm:w-1/3 flex justify-center">
          <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100">
            {userData.avatar ? (
              <img src={userData.avatar} alt={userData.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
                <User className="w-12 h-12" />
              </div>
            )}
          </div>
        </div>
        <div className="mt-4 sm:mt-0 sm:w-2/3 sm:ml-4">
          <dl className="divide-y divide-border">
            <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-secondary-foreground">Nombre completo</dt>
              <dd className="mt-1 text-sm text-primary-foreground sm:mt-0 sm:col-span-2">{userData.name}</dd>
            </div>
            <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-secondary-foreground">Correo electrónico</dt>
              <dd className="mt-1 text-sm text-primary-foreground sm:mt-0 sm:col-span-2 flex items-center">
                <Mail className="w-4 h-4 mr-2" /> {userData.email}
              </dd>
            </div>
            <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-secondary-foreground">Cuenta de Google</dt>
              <dd className="mt-1 text-sm text-primary-foreground sm:mt-0 sm:col-span-2">
                {userData.isGoogleLinked ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-green-100 text-green-800">
                    <Check className="w-4 h-4 mr-1" /> Vinculada
                  </span>
                ) : (
                  <Button variant="secondary" className="inline-flex items-center px-3 py-1.5">
                    Vincular cuenta
                  </Button>
                )}
              </dd>
            </div>
          </dl>
          <div className="mt-5 flex flex-col sm:flex-row gap-3">
            <Button type="button" className="inline-flex items-center px-4 py-2">
              Editar Perfil
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
