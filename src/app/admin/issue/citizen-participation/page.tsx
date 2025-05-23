"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  createParticipacion,
  updateParticipacion,
  fetchParticipacionData,
} from "@/actions/participacion-actions";
import { Loader2 } from "lucide-react";
import ContainerTableVideos from "./container-table-videos";

// Define the Video interface for type safety
interface Video {
  id: number;
  title: string;
  description: string;
  videoUrl: string;
  createdAt: Date;
}

// Define the form schema using Zod
const formSchema = z.object({
  title: z
    .string()
    .min(1, "El título es requerido")
    .max(100, "El título no puede exceder los 100 caracteres"),
  description: z
    .string()
    .min(1, "La descripción es requerida")
    .max(500, "La descripción no puede exceder los 500 caracteres"),
  videoUrl: z
    .string()
    .url("Por favor, ingrese una URL válida")
    .regex(
      /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/.+$/,
      "Por favor, ingrese una URL válida de YouTube"
    ),
});

export default function CitizenParticipationPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingVideoId, setEditingVideoId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const loadVideos = async () => {
    try {
      const data = await fetchParticipacionData();
      setVideos(data);
    } catch (e) {
      console.error("Error al cargar videos", e);
      setError("Error al cargar los videos. Por favor, intenta de nuevo.");
    }
  };

  const handleEdit = (video: Video) => {
    setIsEditing(true);
    setEditingVideoId(video.id);
    form.setValue("title", video.title);
    form.setValue("description", video.description);
    form.setValue("videoUrl", video.videoUrl);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingVideoId(null);
    form.reset();
  };

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(timer);
    }
    if (error) {
      const timer = setTimeout(() => setError(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  // Initialize the form with react-hook-form and Zod resolver
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      videoUrl: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    try {
      if (isEditing && editingVideoId) {
        await updateParticipacion(editingVideoId, data);
        setSuccess("Video actualizado exitosamente");
        setIsEditing(false);
        setEditingVideoId(null);
      } else {
        await createParticipacion(data);
        setSuccess("Video subido exitosamente");
      }
      form.reset();
      await loadVideos(); // Fetch latest videos from server
    } catch {
      setError(
        isEditing
          ? "Error al actualizar el video. Por favor, intenta de nuevo."
          : "Error al subir el video. Por favor, intenta de nuevo."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-background flex flex-col md:flex-row items-start justify-center min-h-screen gap-4 sm:gap-6">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl font-bold text-center">
            {isEditing ? "Editar Video" : "Expresión Ciudadana"}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Título</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Título del video"
                        className="text-sm sm:text-base py-1 sm:py-2 w-full"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Descripción</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Descripción del video"
                        rows={4}
                        className="text-sm sm:text-base py-1 sm:py-2 w-full"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="videoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">URL del Video (YouTube)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://www.youtube.com/embed/..."
                        type="url"
                        className="text-sm sm:text-base py-1 sm:py-2 w-full"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              {success && <p className="text-green-500 text-sm">{success}</p>}
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                <Button
                  type="submit"
                  className="w-full text-sm sm:text-base py-1 sm:py-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : null}
                  {isEditing ? "Actualizar Video" : "Subir Video"}
                </Button>
                {isEditing && (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full text-sm sm:text-base py-1 sm:py-2"
                    onClick={handleCancelEdit}
                    disabled={isSubmitting}
                  >
                    Cancelar
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <ContainerTableVideos
        videos={videos}
        setVideos={setVideos}
        isSubmitting={isSubmitting}
        handleEdit={handleEdit}
      />
    </div>
  );
}