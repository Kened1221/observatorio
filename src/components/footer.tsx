import Image from "next/image";
import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Logo y descripción */}
          <div>
            <div className="flex items-center space-x-2">
              <Image
                src="/public/imgs/img4.jpg"
                alt="Logo Ayacucho"
                width={50}
                height={50}
                className="h-12 w-auto"
              />
              <div>
                <h3 className="text-lg font-bold text-white">
                  INCLUIR PARA CRECER
                </h3>
                <p className="text-sm">AYACUCHO</p>
              </div>
            </div>
            <p className="mt-4 text-sm">
              Política regional para el desarrollo integral de niñas, niños y
              adolescentes de Ayacucho.
            </p>
            <div className="mt-4 flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-white">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white">
                <Instagram className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h3 className="mb-4 text-lg font-bold text-white">
              Enlaces rápidos
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-400 hover:text-white">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-white">
                  ¿Quiénes somos?
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-white">
                  Objetivos
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-white">
                  Documentos
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-white">
                  Noticias
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-white">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Temáticas */}
          <div>
            <h3 className="mb-4 text-lg font-bold text-white">Temáticas</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-400 hover:text-white">
                  Salud y nutrición
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-white">
                  Educación
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-white">
                  Protección social
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-white">
                  Desarrollo económico
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-white">
                  Normas e informes
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-white">
                  Participación ciudadana
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="mb-4 text-lg font-bold text-white">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="mr-2 h-5 w-5 text-primary" />
                <span>Jr. Callao 122, Ayacucho, Perú</span>
              </li>
              <li className="flex items-center">
                <Phone className="mr-2 h-5 w-5 text-primary" />
                <span>(066) 312-890</span>
              </li>
              <li className="flex items-center">
                <Mail className="mr-2 h-5 w-5 text-primary" />
                <span>contacto@incluirparacrecer.gob.pe</span>
              </li>
            </ul>
            <div className="mt-4">
              <Image
                src="/public/imgs/img5.jpg"
                alt="World Vision"
                width={150}
                height={50}
                className="h-10 w-auto"
              />
              <p className="mt-1 text-xs">Con el apoyo de:</p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 py-4">
        <div className="container text-center text-sm">
          <p>
            © {new Date().getFullYear()} INCLUIR PARA CRECER AYACUCHO. Todos los
            derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
