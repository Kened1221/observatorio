/* eslint-disable @next/next/no-img-element */
"use client"

import { useState, useEffect } from 'react';
import { 
  User, 
  Shield, 
  LogOut, 
  Smartphone, 
  History, 
  Key, 
  Mail, 
  AlertCircle, 
  Check, 
  X,
  Loader 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Interfaces y tipos
interface UserData {
  name: string;
  email: string;
  avatar: string | null;
  isGoogleLinked: boolean;
}

interface Session {
  id: number;
  device: string;
  browser: string;
  location: string;
  current?: boolean;
  lastActive?: string;
  timestamp?: string;
  status?: string;
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface Notification {
  show: boolean;
  message: string;
  type: 'success' | 'error' | '';
}

type TabType = 'profile' | 'security' | 'sessions' | 'history';

// Componente principal de la página
const AccountManagement: React.FC = () => {
  // Estados para las diferentes secciones
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [activeSessions, setActiveSessions] = useState<Session[]>([]);
  const [sessionHistory, setSessionHistory] = useState<Session[]>([]);
  const [showPasswordForm, setShowPasswordForm] = useState<boolean>(false);
  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [notification, setNotification] = useState<Notification>({ 
    show: false, 
    message: '', 
    type: '' 
  });

  // Simular carga de datos del usuario
  useEffect(() => {
    // Aquí se haría la llamada a la API para obtener los datos reales
    const fetchData = async (): Promise<void> => {
      try {
        // Simulamos una llamada a API
        setTimeout(() => {
          setUserData({
            name: 'Carlos Rodríguez',
            email: 'carlos.rodriguez@example.com',
            avatar: 'https://api.dicebear.com/6.x/avataaars/svg?seed=Carlos',
            isGoogleLinked: true,
          });
          
          setActiveSessions([
            { id: 1, device: 'MacBook Pro', browser: 'Chrome', location: 'Madrid, España', lastActive: '2025-03-18T12:30:00', current: true },
            { id: 2, device: 'iPhone 16', browser: 'Safari', location: 'Barcelona, España', lastActive: '2025-03-17T18:45:00', current: false }
          ]);
          
          setSessionHistory([
            { id: 101, device: 'Windows PC', browser: 'Firefox', location: 'Valencia, España', timestamp: '2025-03-15T09:20:00', status: 'Cerrada' },
            { id: 102, device: 'Android Tablet', browser: 'Chrome', location: 'Madrid, España', timestamp: '2025-03-10T14:15:00', status: 'Cerrada' },
            { id: 103, device: 'iPad', browser: 'Safari', location: 'Sevilla, España', timestamp: '2025-03-05T20:10:00', status: 'Expirada' }
          ]);
          
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error al cargar datos:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Función para manejar cambios en el formulario de contraseña
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  // Función para enviar el formulario de cambio de contraseña
  const handlePasswordSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    
    // Validaciones básicas
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setNotification({
        show: true,
        message: 'Las contraseñas no coinciden',
        type: 'error'
      });
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      setNotification({
        show: true,
        message: 'La contraseña debe tener al menos 8 caracteres',
        type: 'error'
      });
      return;
    }
    
    // Aquí iría la llamada a la API para cambiar la contraseña
    // Simulamos éxito después de 1 segundo
    setIsLoading(true);
    setTimeout(() => {
      setNotification({
        show: true,
        message: 'Contraseña actualizada correctamente',
        type: 'success'
      });
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setShowPasswordForm(false);
      setIsLoading(false);
    }, 1000);
  };

  // Función para cerrar sesión en un dispositivo
  const handleLogoutDevice = (sessionId: number): void => {
    // Aquí iría la llamada a la API para cerrar la sesión
    setIsLoading(true);
    setTimeout(() => {
      setActiveSessions(prev => prev.filter(session => session.id !== sessionId));
      setNotification({
        show: true,
        message: 'Sesión cerrada correctamente',
        type: 'success'
      });
      setIsLoading(false);
    }, 1000);
  };

  // Función para cerrar la notificación
  const closeNotification = (): void => {
    setNotification({ show: false, message: '', type: '' });
  };

  // Renderizado condicional basado en el estado de carga
  if (isLoading && !userData) {
    return (
      <div className="h-full flex items-center justify-center bg-card">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="mt-2 text-secondary-foreground">Cargando información de la cuenta...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full bg-card">
      {/* Notificación */}
      {notification.show && (
        <div className={`absolute top-4 right-4 max-w-md px-4 py-3 rounded-lg shadow-lg flex items-center space-x-3 z-20 ${
          notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {notification.type === 'success' ? (
            <Check className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <p>{notification.message}</p>
          <button 
            onClick={closeNotification}
            className="ml-auto text-gray-500 hover:text-gray-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-5 sm:px-6">
          <h1 className="text-2xl font-semibold text-primary-foreground">Administración de Cuenta</h1>
          <p className="mt-1 text-sm text-secondary-foreground">
            Gestiona tu perfil, dispositivos y seguridad.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* Menú de navegación */}
          <div className="lg:col-span-1">
            <nav className="space-y-1 bg-card border shadow rounded-lg p-4">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md hover:cursor-pointer ${
                  activeTab === 'profile'
                    ? 'bg-secondary text-secondary-foreground'
                    : 'text-secondary-foreground hover:bg-secondary'
                }`}
              >
                <User className="mr-3 w-5 h-5" />
                <span>Perfil</span>
              </button>

              <button
                onClick={() => setActiveTab('security')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md hover:cursor-pointer ${
                  activeTab === 'security'
                    ? 'bg-secondary text-secondary-foreground'
                    : 'text-secondary-foreground hover:bg-secondary'
                }`}
              >
                <Shield className="mr-3 w-5 h-5" />
                <span>Seguridad</span>
              </button>

              <button
                onClick={() => setActiveTab('sessions')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md hover:cursor-pointer ${
                  activeTab === 'sessions'
                    ? 'bg-secondary text-secondary-foreground'
                    : 'text-secondary-foreground hover:bg-secondary'
                }`}
              >
                <Smartphone className="mr-3 w-5 h-5" />
                <span>Sesiones Activas</span>
              </button>

              <button
                onClick={() => setActiveTab('history')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md hover:cursor-pointer ${
                  activeTab === 'history'
                    ? 'bg-secondary text-secondary-foreground'
                    : 'text-secondary-foreground hover:bg-secondary'
                }`}
              >
                <History className="mr-3 w-5 h-5" />
                <span>Historial de Sesiones</span>
              </button>
            </nav>
          </div>

          {/* Contenido principal */}
          <div className="lg:col-span-3">
            <div className="bg-card border text-primary-foreground shadow rounded-lg">
              {/* Sección de Perfil */}
              {activeTab === 'profile' && userData && (
                <div className="px-4 py-5 sm:p-6">
                  <h2 className="text-lg font-medium text-primary-foreground">Información del Perfil</h2>
                  <div className="mt-5 flex flex-col sm:flex-row">
                    <div className="sm:w-1/3 flex justify-center">
                      <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100">
                        {userData.avatar ? (
                          <img
                            src={userData.avatar}
                            alt={userData.name}
                            className="w-full h-full object-cover"
                          />
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
                          <dd className="mt-1 text-sm text-primary-foreground sm:mt-0 sm:col-span-2">
                            {userData.name}
                          </dd>
                        </div>
                        <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                          <dt className="text-sm font-medium text-secondary-foreground">Correo electrónico</dt>
                          <dd className="mt-1 text-sm text-primary-foreground sm:mt-0 sm:col-span-2 flex items-center">
                            <Mail className="w-4 h-4 mr-2 text-primary-foreground" />
                            {userData.email}
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
                              <Button variant={'secondary'} className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm hover:cursor-pointer">
                                Vincular cuenta
                              </Button>
                            )}
                          </dd>
                        </div>
                      </dl>
                      <div className="mt-5 flex flex-col sm:flex-row gap-3">
                        <Button
                          type="button"
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white hover:cursor-pointer"
                        >
                          Editar Perfil
                        </Button>
                        {!userData.isGoogleLinked && (
                          <button
                            type="button"
                            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            Vincular Google
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Sección de Seguridad */}
              {activeTab === 'security' && (
                <div className="px-4 py-5 sm:p-6">
                  <h2 className="text-lg font-medium text-primary-foreground">Seguridad de la Cuenta</h2>
                  <div className="mt-5">
                    <dl className="divide-y divide-border">
                      <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                        <dt className="text-sm font-medium text-secondary-foreground">Contraseña</dt>
                        <dd className="mt-1 text-sm text-primary-foreground sm:mt-0 sm:col-span-2 flex items-center justify-between">
                          <div className="flex items-center">
                            <Key className="w-4 h-4 mr-2 text-primary-foreground" />
                            <span>••••••••••••</span>
                          </div>
                          <Button
                            variant={'secondary'}
                            onClick={() => setShowPasswordForm(!showPasswordForm)}
                            className="inline-flex items-center px-3 py-1.5 border text-xs font-medium rounded-md shadow-sm"
                          >
                            {showPasswordForm ? 'Cancelar' : 'Cambiar contraseña'}
                          </Button>
                        </dd>
                      </div>
                      
                      {showPasswordForm && (
                        <div className="py-4">
                          <form onSubmit={handlePasswordSubmit} className="space-y-4">
                            <div>
                              <label htmlFor="currentPassword" className="block text-sm font-medium text-secondary-foreground">
                                Contraseña actual
                              </label>
                              <Input
                                type="password"
                                name="currentPassword"
                                id="currentPassword"
                                value={passwordData.currentPassword}
                                onChange={handlePasswordChange}
                                required
                                className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none sm:text-sm"
                              />
                            </div>
                            <div>
                              <label htmlFor="newPassword" className="block text-sm font-medium text-secondary-foreground">
                                Nueva contraseña
                              </label>
                              <Input
                                type="password"
                                name="newPassword"
                                id="newPassword"
                                value={passwordData.newPassword}
                                onChange={handlePasswordChange}
                                required
                                className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none sm:text-sm"
                              />
                            </div>
                            <div>
                              <label htmlFor="confirmPassword" className="block text-sm font-medium text-secondary-foreground">
                                Confirmar nueva contraseña
                              </label>
                              <Input
                                type="password"
                                name="confirmPassword"
                                id="confirmPassword"
                                value={passwordData.confirmPassword}
                                onChange={handlePasswordChange}
                                required
                                className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none sm:text-sm"
                              />
                            </div>
                            <div className="flex justify-end space-x-3">
                              <Button
                                type="button"
                                variant={'outline'}
                                onClick={() => setShowPasswordForm(false)}
                                className="inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md shadow-sm"
                              >
                                Cancelar
                              </Button>
                              <Button
                                type="submit"
                                variant={'default'}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm"
                              >
                                Guardar cambios
                              </Button>
                            </div>
                          </form>
                        </div>
                      )}
                      
                      {userData && (
                        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                          <dt className="text-sm font-medium text-secondary-foreground">Inicio de sesión con Google</dt>
                          <dd className="mt-1 text-sm text-primary-foreground sm:mt-0 sm:col-span-2 flex items-center justify-between">
                            <div className="flex items-center">
                              {userData.isGoogleLinked ? (
                                <>
                                  <svg className="w-5 h-5 mr-2 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                  </svg>
                                  <span>Conectado</span>
                                </>
                              ) : (
                                <span>No conectado</span>
                              )}
                            </div>
                            {userData.isGoogleLinked ? (
                              <Button
                                type="button"
                                variant={'secondary'}
                                className="inline-flex items-center px-3 py-1.5 border text-xs font-medium rounded-md shadow-sm"
                              >
                                Desvincular
                              </Button>
                            ) : (
                              <Button
                                type="button"
                                variant={'secondary'}
                                className="inline-flex items-center px-3 py-1.5 border text-xs font-medium rounded-md shadow-sm"
                              >
                                Conectar con Google
                              </Button>
                            )}
                          </dd>
                        </div>
                      )}
                    </dl>
                  </div>
                </div>
              )}

              {/* Sección de Sesiones Activas */}
              {activeTab === 'sessions' && (
                <div className="px-4 py-5 sm:p-6">
                  <h2 className="text-lg font-medium text-primary-foreground">Sesiones Activas</h2>
                  <p className="mt-1 text-sm text-secondary-foreground">
                    Dispositivos donde tu cuenta está actualmente conectada.
                  </p>
                  <div className="mt-5">
                    <ul className="divide-y divide-border">
                      {activeSessions.map((session) => (
                        <li key={session.id} className="py-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Smartphone className="w-10 h-10 text-secondary-foreground" />
                              <div className="ml-3">
                                <p className="text-sm font-medium text-secondary-foreground">
                                  {session.device} {session.current && (
                                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                      Actual
                                    </span>
                                  )}
                                </p>
                                <div className="flex mt-1">
                                  <p className="text-xs text-primary-foreground mr-3">
                                    <span className="font-medium">Navegador:</span> {session.browser}
                                  </p>
                                  <p className="text-xs text-primary-foreground mr-3">
                                    <span className="font-medium">Ubicación:</span> {session.location}
                                  </p>
                                  <p className="text-xs text-primary-foreground">
                                    <span className="font-medium">Activo:</span> {session.lastActive && new Date(session.lastActive).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            </div>
                            {!session.current && (
                              <Button
                                onClick={() => handleLogoutDevice(session.id)}
                                variant={'destructive'}
                                className="inline-flex items-center px-3 py-1.5 border text-xs font-medium rounded-md shadow-sm"
                              >
                                <LogOut className="w-3 h-3 mr-1" /> Cerrar sesión
                              </Button>
                            )}
                          </div>
                        </li>
                      ))}
                      {activeSessions.length === 0 && (
                        <li className="py-8 text-center text-primary-foreground">
                          No hay sesiones activas actualmente.
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              )}

              {/* Sección de Historial de Sesiones */}
              {activeTab === 'history' && (
                <div className="px-4 py-5 sm:p-6">
                  <h2 className="text-lg font-medium text-primary-foreground">Historial de Sesiones</h2>
                  <p className="mt-1 text-sm text-secondary-foreground">
                    Registro de inicios de sesión recientes en tu cuenta.
                  </p>
                  <div className="mt-5">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-border">
                        <thead className="bg-card">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-foreground uppercase tracking-wider">
                              Dispositivo
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-foreground uppercase tracking-wider">
                              Ubicación
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-foreground uppercase tracking-wider">
                              Fecha y Hora
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-foreground uppercase tracking-wider">
                              Estado
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-card divide-y divide-border">
                          {sessionHistory.map((session) => (
                            <tr key={session.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <Smartphone className="w-5 h-5 text-primary-foreground mr-2" />
                                  <div className="text-sm font-medium text-primary-foreground">
                                    {session.device}
                                  </div>
                                </div>
                                <div className="text-xs text-secondary-foreground mt-1">
                                  {session.browser}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-secondary-foreground">{session.location}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {session.timestamp && (
                                  <>
                                    <div className="text-sm text-primary-foreground">
                                      {new Date(session.timestamp).toLocaleDateString()}
                                    </div>
                                    <div className="text-xs text-secondary-foreground">
                                      {new Date(session.timestamp).toLocaleTimeString()}
                                    </div>
                                  </>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {session.status && (
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    session.status === 'Cerrada' ? 'bg-gray-100 text-gray-800' : 'bg-yellow-100 text-yellow-800'
                                  }`}>
                                    {session.status}
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {sessionHistory.length === 0 && (
                        <div className="py-8 text-center text-gray-500">
                          No hay historial de sesiones disponible.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AccountManagement;