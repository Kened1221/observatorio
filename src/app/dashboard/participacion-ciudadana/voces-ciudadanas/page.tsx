"use client";
import Image from "next/image";
import Script from "next/script";
import { useEffect, useState } from "react";

export default function ContainerVoces() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return <div>Cargando...</div>;

  return (
    <div className="container mx-auto px-4 lg:py-8">
      {/* Contenedor principal con flex y bordes redondeados */}
      <div className="flex flex-col lg:flex-row items-stretch pt-4 w-full lg:w-9/10 mx-auto rounded-2xl overflow-hidden shadow-lg">
        {/* Imagen: esquinas superiores redondeadas en móviles y esquinas izquierdas en pantallas grandes */}
        <Image
          src="/logos/barra_oscuro.png"
          alt="Participacion"
          width={300}
          height={300}
          className="bg-red-500 rounded-t-2xl lg:rounded-none lg:rounded-l-2xl w-full"
        />

        {/* Sección derecha: Degradado de rojo a blanco */}
        <div className="flex flex-col justify-center gap-6 p-8 bg-gradient-to-b lg:bg-gradient-to-r from-red-500 to-white">
          <h2 className="text-4xl font-bold text-center text-white lg:text-black drop-shadow-md">
            Voces ciudadanas
          </h2>
          <p className="text-lg text-white lg:text-black text-justify leading-relaxed drop-shadow-sm">
            Voces Ciudadanas se dedica a escuchar de forma atenta a cada
            ciudadano, utilizando una amplia gama de canales digitales y redes
            sociales del gobierno regional para captar opiniones en todas sus
            expresiones, desde felicitaciones hasta críticas y propuestas. Esta
            plataforma transforma la diversidad de voces en una herramienta
            constructiva que permite a las autoridades tomar decisiones
            informadas y mejorar efectivamente los servicios públicos. ¡Cada voz
            es esencial para impulsar un cambio positivo!
          </p>
        </div>
      </div>

      {/* Sección de redes sociales con el mismo tamaño y estilo */}
      <div className="flex flex-col lg:flex-row justify-center gap-8 mt-8 items-center">
        {/* Instagram */}
        <iframe
          src="https://www.instagram.com/goreayacucho/embed"
          allow-transparency="true"
          allowFullScreen
          className="w-full h-[500px] bg-white rounded-2xl border border-[#dbdbdb] shadow-none"
        />

        {/* TikTok: lo envolvemos en un contenedor para forzar tamaño fijo */}
        <div
          className="
            w-full
            h-[500px]
            bg-white
            rounded-2xl
            border
            border-[#dbdbdb]
            shadow-none
            overflow-hidden
          "
        >
          <blockquote
            className="tiktok-embed w-full h-full"
            cite="https://www.tiktok.com/@gore_ayacucho"
            data-unique-id="gore_ayacucho"
            data-embed-type="creator"
          >
            <section className="flex items-center justify-center w-full h-full">
              <a
                target="_blank"
                href="https://www.tiktok.com/@gore_ayacucho?refer=creator_embed"
              >
                @gore_ayacucho
              </a>
            </section>
          </blockquote>
        </div>
        <Script
          async
          src="https://www.tiktok.com/embed.js"
          strategy="afterInteractive"
        />
        {/* Facebook */}
        <iframe
          src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fgobiernoregionalayacucho&tabs=timeline&width=480&height=500&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true"
          allowFullScreen
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          className="
            w-full
            h-[500px]
            bg-white
            rounded-2xl
            border
            border-[#dbdbdb]
            shadow-none
          "
        ></iframe>
      </div>
    </div>
  );
}
