"use client";

import { useState, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteImg, getNews } from "@/actions/notar-actualidad";
import {
  Pencil,
  Trash2,
  Loader2,
  RefreshCw,
  ArrowUpDown,
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Image {
  id: string;
  url: string;
  title: string;
  description: string;
  date: Date;
}

interface ContainerTablePresentProps {
  images: Image[];
  setImages: React.Dispatch<React.SetStateAction<Image[]>>;
  isSubmitting: boolean;
  handleEdit: (image: Image) => void;
}

export default function ContainerTablePresent({
  images,
  setImages,
  isSubmitting,
  handleEdit,
}: ContainerTablePresentProps) {
  const [isLoadingImages, setIsLoadingImages] = useState<boolean>(false);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [showConfirmationModal, setShowConfirmationModal] = useState<boolean>(false);
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const debouncedSetSearchQuery = useCallback(
    (value: string) => {
      const handler = setTimeout(() => {
        setSearchQuery(value);
        setCurrentPage(1);
      }, 300);
      return () => clearTimeout(handler);
    },
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSetSearchQuery(e.target.value);
  };

  const loadImages = async () => {
    setIsLoadingImages(true);
    try {
      const response: { status: number; data: { id: string; description: string; detalles: string; imagenUrl: string; date: Date }[]; message?: string } = await getNews();
      if (response.status === 200) {
        const fetchedImages: Image[] = response.data.map((item) => ({
          id: item.id,
          url: item.imagenUrl,
          title: item.description,
          description: item.detalles,
          date: item.date,
        }));
        setImages(fetchedImages);
      }
    } catch (e) {
      console.error("Error al cargar imágenes", e);
    } finally {
      setIsLoadingImages(false);
    }
  };

  const handleDelete = (id: string) => {
    setImageToDelete(id);
    setShowConfirmationModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!imageToDelete) return;
    try {
      const response = await deleteImg(imageToDelete);
      if (response.status === 200) {
        setImages((prev) => prev.filter((image) => image.id !== imageToDelete));
        setShowConfirmationModal(false);
        setImageToDelete(null);
        setCurrentPage(1);
      }
    } catch {
      console.error("Error al eliminar la imagen");
    }
  };

  const handleCloseConfirmationModal = () => {
    setShowConfirmationModal(false);
    setImageToDelete(null);
  };

  const handleSort = () => {
    const newSortOrder = sortOrder === "desc" ? "asc" : "desc";
    setSortOrder(newSortOrder);
    setImages((prev) =>
      [...prev].sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return newSortOrder === "desc" ? dateB - dateA : dateA - dateB;
      })
    );
    setCurrentPage(1);
  };

  const filteredImages = useMemo(
    () =>
      images.filter(
        (image) =>
          image.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          image.description.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [images, searchQuery]
  );

  const paginatedImages = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredImages.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredImages, currentPage]);

  const totalPages = Math.ceil(filteredImages.length / itemsPerPage);

  return (
    <Card className="w-full lg:flex-1 max-w-full lg:max-w-7xl shadow-lg">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <CardTitle className="text-xl sm:text-2xl font-semibold">Registros Subidos</CardTitle>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-48 lg:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" aria-hidden="true" />
            <Input
              placeholder="Buscar por título o descripción..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-8 text-sm w-full"
              aria-label="Buscar registros"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={loadImages}
            disabled={isLoadingImages}
            className="w-full sm:w-auto"
            aria-label="Actualizar registros"
          >
            {isLoadingImages ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" aria-hidden="true" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" aria-hidden="true" />
            )}
            Actualizar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        {isLoadingImages ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-8 h-8 animate-spin text-primary" aria-hidden="true" />
          </div>
        ) : paginatedImages.length === 0 ? (
          <div className="text-center py-10 text-gray-500 text-sm">
            {searchQuery
              ? "No se encontraron registros que coincidan con la búsqueda."
              : "No hay registros disponibles."}
          </div>
        ) : (
          <Table className="w-full min-w-[600px]">
            <TableHeader>
              <TableRow className="hover:bg-gray-50">
                <TableHead className="text-xs sm:text-sm font-medium w-[150px] sm:w-[200px]" scope="col">
                  Título
                </TableHead>
                <TableHead className="text-xs sm:text-sm font-medium w-[200px] lg:w-[300px] hidden sm:table-cell" scope="col">
                  Descripción
                </TableHead>
                <TableHead className="text-xs sm:text-sm font-medium w-[120px] sm:w-[150px]" scope="col">
                  <button
                    type="button"
                    className="flex items-center w-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    onClick={handleSort}
                    aria-label={`Ordenar por fecha (${sortOrder === "asc" ? "ascendente" : "descendente"})`}
                  >
                    Fecha
                    <ArrowUpDown className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
                  </button>
                </TableHead>
                <TableHead className="text-xs sm:text-sm font-medium text-right w-[80px] sm:w-[100px]" scope="col">
                  Acciones
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedImages.map((image) => (
                <TableRow key={image.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <TableCell
                    className="py-2 sm:py-4 text-xs sm:text-sm truncate max-w-[150px] sm:max-w-[200px]"
                    title={image.title}
                  >
                    {image.title}
                  </TableCell>
                  <TableCell
                    className="py-2 sm:py-4 text-xs sm:text-sm truncate max-w-[200px] lg:max-w-[300px] hidden sm:table-cell"
                    title={image.description}
                  >
                    {image.description}
                  </TableCell>
                  <TableCell className="py-2 sm:py-4 text-xs sm:text-sm">
                    {new Date(image.date).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="py-2 sm:py-4 text-right space-x-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="secondary"
                            size="icon"
                            onClick={() => handleEdit(image)}
                            className="h-7 w-7 sm:h-8 sm:w-8 text-amber-400"
                            aria-label={`Editar registro ${image.title}`}
                          >
                            <Pencil className="w-3 h-3 sm:w-4 sm:h-4" aria-hidden="true" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Editar registro</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleDelete(image.id)}
                            className="h-7 w-7 sm:h-8 sm:w-8"
                            disabled={isSubmitting}
                            aria-label={`Eliminar registro ${image.title}`}
                          >
                            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" aria-hidden="true" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Eliminar registro</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-4">
            <Button
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              aria-label="Página anterior"
            >
              Anterior
            </Button>
            <span>
              Página {currentPage} de {totalPages}
            </span>
            <Button
              variant="outline"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              aria-label="Página siguiente"
            >
              Siguiente
            </Button>
          </div>
        )}
      </CardContent>
      <AlertDialog
        open={showConfirmationModal}
        onOpenChange={setShowConfirmationModal}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro de eliminar este registro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El registro será eliminado permanentemente de la base de datos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={handleCloseConfirmationModal}
              disabled={isSubmitting}
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-500 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" aria-hidden="true" />
              ) : null}
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}