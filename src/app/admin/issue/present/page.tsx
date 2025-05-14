/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/dialog-confirm";
import { Calendar } from "@/components/ui/calendar";
import DragDropImgInput from "@/components/ui/drag-drop-img-input";
import {
  guardarImg,
  updateImg,
  getNews,
} from "@/actions/notar-actualidad";
import ContainerTablePresent from "./container-table-present";
// Define the form schema using Zod
const formSchema = z.object({
  id: z.string().optional(),
  title: z
    .string()
    .min(1, "El título es requerido")
    .max(100, "El título no puede exceder los 100 caracteres"),
  description: z
    .string()
    .min(1, "La descripción es requerida")
    .max(500, "La descripción no puede exceder los 500 caracteres"),
  date: z.date({
    required_error: "La fecha es requerida",
  }),
  image: z
    .instanceof(File)
    .optional()
    .nullable(),
});

// Mock function to simulate file upload
async function saveFile(file: File): Promise<string> {
  const uniqueFileName = `${uuidv4()}-${file.name}`;
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(uniqueFileName);
    }, 1000);
  });
}

interface Image {
  id: string;
  url: string;
  title: string;
  description: string;
  date: Date;
}

export default function Page() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [images, setImages] = useState<Image[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: "",
      title: "",
      description: "",
      date: undefined,
      image: null,
    },
  });

  const loadImages = async () => {
    try {
      const response = await getNews();
      if (response.status === 200) {
        const fetchedImages = response.data.map((item: any) => ({
          id: item.id,
          url: item.imagenUrl,
          title: item.description,
          description: item.detalles,
          date: new Date(item.date),
        }));
        setImages(fetchedImages);
      } else {
        setError(response.message);
      }
    } catch (e) {
      console.error("Error al cargar imágenes", e);
      setError("Error al cargar las imágenes. Por favor, intenta de nuevo.");
    }
  };

  useEffect(() => {
    loadImages();
  }, []);

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

  const handleEdit = (image: Image) => {
    setIsEditing(true);
    form.setValue("id", image.id);
    form.setValue("title", image.title);
    form.setValue("description", image.description);
    form.setValue("date", image.date);
    form.setValue("image", null);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    form.reset();
  };

  async function handleFileUpload(file: File) {
    if (!file) {
      throw new Error("No se ha proporcionado ningún archivo");
    }
    return await saveFile(file);
  }

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    try {
      let imageUrl: string;
      if (isEditing) {
        // For editing, use existing URL if no new image is provided
        const existingImage = images.find((img) => img.id === data.id);
        if (!existingImage) {
          throw new Error("Registro no encontrado para actualizar");
        }
        imageUrl = data.image ? `/uploads/${await handleFileUpload(data.image)}` : existingImage.url;
        const response = await updateImg(
          data.id!,
          imageUrl,
          data.title,
          data.description,
          data.date.toISOString()
        );
        if (response.status === 200) {
          setSuccess("Registro actualizado exitosamente");
          form.reset();
          setIsEditing(false);
          await loadImages();
          handleCloseConfirmationModal();
        } else {
          setError(response.message);
        }
      } else {
        // For creating, require an image
        if (!data.image) {
          throw new Error("Se requiere una imagen para crear un registro");
        }
        imageUrl = `/uploads/${await handleFileUpload(data.image)}`;
        const response = await guardarImg(
          imageUrl,
          data.title,
          data.description,
          data.date.toISOString()
        );
        if (response.status === 200) {
          setSuccess("Registro guardado exitosamente");
          form.reset();
          await loadImages();
          handleCloseConfirmationModal();
        } else {
          setError(response.message);
        }
      }
    } catch {
      setError(
        isEditing
          ? "Error al actualizar el registro. Por favor, intenta de nuevo."
          : "Error al guardar el registro. Por favor, intenta de nuevo."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShowConfirmationModal = () => {
    setShowConfirmationModal(true);
  };

  const handleCloseConfirmationModal = () => {
    setShowConfirmationModal(false);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-background flex flex-col lg:flex-row items-start justify-center min-h-screen gap-4 sm:gap-6">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl font-bold text-center">
            {isEditing ? "Editar Registro" : "Nuevo Registro"}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleShowConfirmationModal)} className="space-y-4 sm:space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Título</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Título del registro"
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
                        placeholder="Descripción del registro"
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
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Fecha</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={`w-full pl-3 text-left font-normal text-sm sm:text-base ${
                              !field.value && "text-muted-foreground"
                            }`}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: es })
                            ) : (
                              <span>Seleccionar fecha</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          locale={es}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Imagen</FormLabel>
                    <FormControl>
                      <DragDropImgInput
                        img={field.value}
                        setImg={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              {success && <p className="text-primary text-sm">{success}</p>}
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/50 text-sm sm:text-base py-1 sm:py-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : null}
                  {isEditing ? "Actualizar Registro" : "Guardar Registro"}
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
      <ContainerTablePresent
        images={images}
        setImages={setImages}
        isSubmitting={isSubmitting}
        handleEdit={handleEdit}
      />
      <ConfirmDialog
        isOpen={showConfirmationModal}
        onClose={handleCloseConfirmationModal}
        onConfirm={() => form.handleSubmit(onSubmit)()}
        title={isEditing ? "¿Estás seguro de actualizar este registro?" : "¿Estás seguro de guardar este registro?"}
        description="Por favor, confirma tu acción."
        styleButton="bg-[#0E8E8D] hover:bg-[#36BFC5]"
      />
    </div>
  );
}