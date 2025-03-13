/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import clsx from "clsx";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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
  return parts.length > 1 ? parts[1].split("?")[0] : "";
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
  const [selectedVideo, setSelectedVideo] = useState<VideoItem>(videos[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false);

  const playerContainerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);

  const loadYouTubePlayer = () => {
    if (playerContainerRef.current) {
      playerRef.current = new window.YT.Player(playerContainerRef.current, {
        videoId: getVideoId(selectedVideo.videoUrl),
        playerVars: { autoplay: 0, controls: 1 },
        events: {
          onReady: () => setIsPlayerReady(true),
        },
      });
    }
  };

  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      window.onYouTubeIframeAPIReady = loadYouTubePlayer;
    } else {
      if (playerRef.current && isPlayerReady) {
        playerRef.current.loadVideoById(getVideoId(selectedVideo.videoUrl));
      } else if (!playerRef.current) {
        loadYouTubePlayer();
      }
    }
  }, [selectedVideo, isPlayerReady]);

  const togglePlayback = () => {
    if (playerRef.current && isPlayerReady) {
      const state = playerRef.current.getPlayerState();
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
    <div className="h-full py-12 md:py-20 bg-white flex items-center justify-center">
      <div className="w-full max-w-[80%] mx-auto grid grid-cols-1 2xl:grid-cols-[1fr_2fr] gap-8 items-center">
        <div className="space-y-6 p-6 flex flex-col w-full">
          <p className="text-gray-600 text-center sm:text-start text-xl md:text-3xl mb-2">
            Expresión ciudadana
          </p>
          <p className="text-gray-500 text-lg leading-relaxed text-justify">
            Esta plataforma busca enriquecer el diálogo público a través de
            entrevistas con especialistas en desarrollo y académicos.
          </p>
          <Carousel className="w-full">
            <CarouselContent className="flex">
              {videos.map((item) => (
                <CarouselItem
                  key={item.id}
                  className="basis-1/1 lg:basis-1/2"
                  onClick={() => setSelectedVideo(item)}
                >
                  <Card
                    className={`cursor-grabbing ${
                      selectedVideo.id === item.id
                        ? "border-4 border-blue-500"
                        : ""
                    }`}
                  >
                    <CardContent className="flex flex-col items-center p-3 h-[250px]">
                      <div className="relative w-full h-30 rounded-lg overflow-hidden">
                        <Image
                          src={getThumbnail(item.videoUrl)}
                          alt={item.title}
                          fill
                          className="object-cover rounded-md"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-semibold mt-2 text-justify">
                          {item.title}
                        </p>
                        <p className="text-sm font-semibold mt-2 text-justify">
                          {item.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
          <Button
            className={clsx(
              "text-white rounded-full px-8 py-6 flex items-center gap-2 transition-transform hover:scale-105",
              isPlaying
                ? "bg-red-600 hover:bg-red-700"
                : "bg-purple-600 hover:bg-purple-700"
            )}
            onClick={togglePlayback}
          >
            <Play className="w-5 h-5" />
            {isPlaying ? "Pausar" : "Reproducir"}
          </Button>
        </div>
        <div className="rounded-lg overflow-hidden shadow-2xl w-full">
          <div
            className="w-full h-full aspect-video bg-black"
            ref={playerContainerRef}
          ></div>
        </div>
      </div>
    </div>
  );
}
