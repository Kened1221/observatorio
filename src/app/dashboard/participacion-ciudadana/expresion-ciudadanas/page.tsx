/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VideoItem {
  id: number;
  title: string;
  description: string;
  videoUrl: string;
}

const videos: VideoItem[] = [
  {
    id: 1,
    title: "Video 1",
    description: "Esta es la descripción del Video 1.",
    videoUrl: "https://www.youtube.com/embed/rs1YAkfF8QM",
  },
  {
    id: 2,
    title: "Video 2",
    description: "Esta es la descripción del Video 2.",
    videoUrl: "https://www.youtube.com/embed/C8XAcfyFTfk",
  },
  {
    id: 3,
    title: "Video 3",
    description: "Esta es la descripción del Video 3.",
    videoUrl: "https://www.youtube.com/embed/IaTGzcc9h-4?si=yk6Qb5jc82TRbEm-",
  },
  {
    id: 4,
    title: "Video 4",
    description: "Esta es la descripción del Video 4.",
    videoUrl: "https://www.youtube.com/embed/9xqOhlAESk0?si=Gbb4nf-hY4mbjY8h",
  },
];

const getVideoId = (videoUrl: string) => {
  const parts = videoUrl.split("/embed/");
  if (parts.length > 1) {
    return parts[1].split("?")[0];
  }
  return "";
};

const getThumbnail = (videoUrl: string) => {
  const videoId = getVideoId(videoUrl);
  return videoId
    ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    : "/placeholder-thumbnail.jpg";
};

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export default function Page() {
  // Video seleccionado (por defecto el primero)
  const [selectedVideo, setSelectedVideo] = useState<VideoItem>(videos[0]);
  // Estado para saber si se está reproduciendo (true) o pausado (false)
  const [isPlaying, setIsPlaying] = useState(false);
  // Estado para saber si el reproductor está listo
  const [isPlayerReady, setIsPlayerReady] = useState(false);

  // Referencia para el contenedor del reproductor y para la instancia del reproductor
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);

  // Función para cargar e inicializar la API de YouTube
  const loadYouTubePlayer = () => {
    if (playerContainerRef.current) {
      playerRef.current = new window.YT.Player(playerContainerRef.current, {
        videoId: getVideoId(selectedVideo.videoUrl),
        playerVars: { autoplay: 0, controls: 1 },
        events: {
          onReady: () => {
            setIsPlayerReady(true);
          },
        },
      });
    }
  };

  useEffect(() => {
    if (!window.YT) {
      // Si la API aún no está cargada, se carga dinámicamente
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      window.onYouTubeIframeAPIReady = loadYouTubePlayer;
    } else {
      if (playerRef.current && isPlayerReady) {
        // Si el reproductor ya está listo, carga el nuevo video
        playerRef.current.loadVideoById(getVideoId(selectedVideo.videoUrl));
      } else if (!playerRef.current) {
        loadYouTubePlayer();
      }
    }
  }, [selectedVideo, isPlayerReady]);

  // Toggle de reproducción: pausa o reproduce el video sin reinicializar el reproductor
  const togglePlayback = () => {
    if (playerRef.current && isPlayerReady) {
      const state = playerRef.current.getPlayerState();
      // Estado 1: reproduciendo, 2: pausado
      if (state === 1) {
        playerRef.current.pauseVideo();
        setIsPlaying(false);
      } else {
        playerRef.current.playVideo();
        setIsPlaying(true);
      }
    }
  };

  return (
    <main className="h-full pt-12 bg-white flex items-center justify-center p-4">
      {/* Fondo de imagen con overlay */}
      <div
        className="absolute bg-cover bg-center bg-no-repeat blur-sm"
        style={{
          backgroundImage: "url(/placeholder.svg?height=1080&width=1920)",
          opacity: 0.3,
        }}
      />
      <div className="relative z-10 w-full max-w-[80%] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Izquierda: Texto y carrusel horizontal */}
        <div className="space-y-6 pt-6">
          <p className="text-gray-600 uppercase tracking-wider text-xl md:text-3xl mb-2">
            Expresión ciudadana
          </p>
          <p className="text-gray-500 text-lg leading-relaxed text-justify">
            Esta plataforma busca enriquecer el diálogo público a través de
            entrevistas con especialistas en desarrollo y académicos, y actúa
            como un puente entre la ciudadanía y la toma de decisiones,
            impulsando un futuro más participativo e informado.
          </p>

          {/* Carrusel horizontal */}
          <div className="flex space-x-4 space-y-2 overflow-x-auto snap-x snap-mandatory custom-scrollbar">
            {videos.map((video) => (
              <div
                key={video.id}
                className={`min-w-[300px] bg-white rounded-xl shadow-md p-4 snap-start cursor-pointer transition-all ${
                  video.id === selectedVideo.id
                    ? "border-4 border-purple-600"
                    : ""
                }`}
                onClick={() => {
                  setSelectedVideo(video);
                  setIsPlaying(false);
                }}
              >
                <div className="relative h-40 w-full mb-2">
                  <Image
                    src={getThumbnail(video.videoUrl)}
                    alt={video.title}
                    fill
                    className="object-cover rounded-md"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Play className="w-10 h-10 text-white opacity-80" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold">{video.title}</h3>
                <p className="text-gray-500 text-sm">{video.description}</p>
              </div>
            ))}
          </div>

          {/* Botón para reproducir o pausar el video seleccionado */}
          <Button
            className={`${
              isPlaying
                ? "bg-red-600 hover:bg-red-700"
                : "bg-purple-600 hover:bg-purple-700"
            } text-white rounded-full px-8 py-6 flex items-center gap-2 transition-transform hover:scale-105`}
            onClick={togglePlayback}
          >
            <Play className="w-5 h-5" />
            {isPlaying ? "Pausar" : "Reproducir"}
          </Button>
        </div>

        {/* Derecha: Contenedor del reproductor de video */}
        <div className="rounded-lg overflow-hidden shadow-2xl w-full h-full">
          <div
            className="w-full h-full aspect-video bg-black"
            ref={playerContainerRef}
          ></div>
        </div>
      </div>
    </main>
  );
}
