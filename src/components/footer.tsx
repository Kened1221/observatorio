import {
  FaFacebook,
  FaTiktok,
  FaYoutube,
  FaClock,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { BsInstagram } from "react-icons/bs";
import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const googleMapsUrl =
    "https://www.google.com/maps?q=Jr.+Callao+122,+Ayacucho,+Huamanga,+Ayacucho";

  return (
    <footer className="bg-[#E30513] text-gray-300 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 text-white gap-8">
          {/* Brand Section */}
          <div className="flex flex-col items-start text-center md:text-left space-y-4 p-4">
            <div className="w-full flex justify-center">
              <Image
                src="/logos/logo_blanco.jpg"
                alt="Logo del Gobierno Regional de Ayacucho"
                width={100}
                height={100}
                className="object-contain"
                priority
              />
            </div>
            <h3 className="text-xl font-bold uppercase tracking-wide">
              Gobierno Regional de Ayacucho - GORE Ayacucho
            </h3>
            <p className="text-sm leading-relaxed max-w-xs">
              Página oficial del Gobierno Regional de Ayacucho. Información
              sobre proyectos, noticias y gestiones del GORE Ayacucho.
            </p>
            <div className="flex space-x-4 pt-2">
              {[
                {
                  href: "https://www.facebook.com/gobiernoregionalayacucho/?locale=es_LA",
                  Icon: FaFacebook,
                },
                { href: "https://x.com/GoreAyacucho", Icon: FaXTwitter },
                {
                  href: "https://www.instagram.com/GoreAyacucho",
                  Icon: BsInstagram,
                },
                {
                  href: "https://www.youtube.com/@gobiernoregionaldeayacucho4491",
                  Icon: FaYoutube,
                },
                {
                  href: "https://www.tiktok.com/@gore_ayacucho",
                  Icon: FaTiktok,
                },
              ].map(({ href, Icon }, index) => (
                <a
                  key={index}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors duration-200"
                  aria-label={`Visítanos en ${href.split(".")[1]}`}
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Contact Section */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left text-white space-y-4 p-4">
            <h3 className="text-xl font-bold uppercase tracking-wide">
              Contáctanos
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <FaMapMarkerAlt className="mt-1 flex-shrink-0" size={16} />
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:text-orange-100 transition-colors duration-200"
                >
                  Jr. Callao N° 122, Ayacucho, Huamanga, Ayacucho
                </a>
              </div>
              <div className="flex items-start space-x-3">
                <FaClock className="mt-1 flex-shrink-0" size={16} />
                <p className="text-sm">
                  Lunes a Viernes: 8:00 am - 1:00 pm / 2:30 pm - 4:30 pm
                </p>
              </div>
            </div>
          </div>

          {/* Map Section */}
          <div className="flex justify-center p-4">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d879.0501200375841!2d-74.22699547567207!3d-13.159395031085609!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x91127df3b33762fb%3A0x4e67d8740fe84e27!2sGobierno%20Regional%20de%20Ayacucho%2C%20Jr.%20Cusco%2C%20Ayacucho%2005003!5e1!3m2!1ses-419!2spe!4v1741352681183!5m2!1ses-419!2spe"
              width="100%"
              height="100%"
              className="rounded-lg border-0 max-w-sm"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación del Gobierno Regional de Ayacucho"
            />
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-200 mt-8 pt-6">
          <p className="text-center text-xs text-gray-200">
            © {currentYear} Oficina de Tecnologías de la Información y
            Comunicaciones. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
