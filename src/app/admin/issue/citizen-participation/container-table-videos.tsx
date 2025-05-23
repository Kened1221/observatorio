import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  deleteParticipacion,
  fetchParticipacionData,
} from "@/actions/participacion-actions";
import {
  Pencil,
  Trash2,
  Loader2,
  RefreshCw,
  ArrowUpDown,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Define the Video interface for type safety
interface Video {
  id: number;
  title: string;
  description: string;
  videoUrl: string;
  createdAt: Date;
}

interface ContainerTableVideosProps {
  videos: Video[];
  setVideos: React.Dispatch<React.SetStateAction<Video[]>>;
  isSubmitting: boolean;
  handleEdit: (video: Video) => void;
}

export default function ContainerTableVideos({
  videos,
  setVideos,
  isSubmitting,
  handleEdit,
}: ContainerTableVideosProps) {
  const [isLoadingVideos, setIsLoadingVideos] = useState<boolean>(false);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [showConfirmationModal, setShowConfirmationModal] = useState<boolean>(false);
  const [videoToDelete, setVideoToDelete] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const loadVideos = async () => {
    setIsLoadingVideos(true);
    try {
      const data = await fetchParticipacionData();
      setVideos(data);
    } catch (e) {
      console.error("Error al cargar videos", e);
    } finally {
      setIsLoadingVideos(false);
    }
  };

  const handleDelete = (id: number) => {
    setVideoToDelete(id);
    setShowConfirmationModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!videoToDelete) return;
    try {
      await deleteParticipacion(videoToDelete);
      setVideos((prev) => prev.filter((video) => video.id !== videoToDelete));
      setShowConfirmationModal(false);
      setVideoToDelete(null);
    } catch {
      console.error("Error al eliminar el video");
    }
  };

  const handleCloseConfirmationModal = () => {
    setShowConfirmationModal(false);
    setVideoToDelete(null);
  };

  const handleSort = () => {
    const newSortOrder = sortOrder === "desc" ? "asc" : "desc";
    setSortOrder(newSortOrder);
    setVideos((prev) =>
      [...prev].sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return newSortOrder === "desc" ? dateB - dateA : dateA - dateB;
      })
    );
  };

  // Filter videos based on search query
  const filteredVideos = videos.filter(
    (video) =>
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card className="w-full lg:flex-1 max-w-full lg:max-w-7xl shadow-lg">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <CardTitle className="text-xl sm:text-2xl font-semibold">Videos Subidos</CardTitle>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-48 lg:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Buscar por título o descripción..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 text-sm w-full"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={loadVideos}
            disabled={isLoadingVideos}
            className="w-full sm:w-auto"
          >
            {isLoadingVideos ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Actualizar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        {isLoadingVideos ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredVideos.length === 0 ? (
          <div className="text-center py-10 text-gray-500 text-sm">
            {searchQuery
              ? "No se encontraron videos que coincidan con la búsqueda."
              : "No hay videos disponibles."}
          </div>
        ) : (
          <Table className="min-w-fit">
            <TableHeader>
              <TableRow className="hover:bg-gray-50">
                <TableHead className="text-xs sm:text-sm font-medium w-[150px] sm:w-[200px]">
                  Título
                </TableHead>
                <TableHead className="text-xs sm:text-sm font-medium hidden sm:table-cell w-[200px] lg:w-[300px]">
                  Descripción
                </TableHead>
                <TableHead className="text-xs sm:text-sm font-medium w-[120px] sm:w-[150px]">
                  URL
                </TableHead>
                <TableHead
                  className="text-xs sm:text-sm font-medium cursor-pointer w-[120px] sm:w-[150px]"
                  onClick={handleSort}
                >
                  <div className="flex items-center">
                    Fecha
                    <ArrowUpDown className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
                  </div>
                </TableHead>
                <TableHead className="text-xs sm:text-sm font-medium text-right w-[80px] sm:w-[100px]">
                  Acciones
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVideos.map((video) => (
                <TableRow key={video.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <TableCell
                    className="py-2 sm:py-4 text-xs sm:text-sm truncate max-w-[150px] sm:max-w-[200px]"
                    title={video.title}
                  >
                    {video.title}
                  </TableCell>
                  <TableCell
                    className="py-2 sm:py-4 text-xs sm:text-sm truncate max-w-[200px] lg:max-w-[300px] hidden sm:table-cell"
                    title={video.description}
                  >
                    {video.description}
                  </TableCell>
                  <TableCell className="py-2 sm:py-4 text-xs sm:text-sm">
                    <a
                      href={video.videoUrl}
                      className="text-blue-600 underline truncate max-w-[120px] sm:max-w-[150px] block"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Ver video
                    </a>
                  </TableCell>
                  <TableCell className="py-2 sm:py-4 text-xs sm:text-sm">
                    {new Date(video.createdAt).toLocaleDateString("es-ES", {
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
                            onClick={() => handleEdit(video)}
                            className="h-7 w-7 sm:h-8 sm:w-8 text-amber-400"
                          >
                            <Pencil className="w-3 h-3 sm:w-4 sm:h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Editar video</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleDelete(video.id)}
                            className="h-7 w-7 sm:h-8 sm:w-8"
                            disabled={isSubmitting}
                          >
                            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Eliminar video</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
      <AlertDialog
        open={showConfirmationModal}
        onOpenChange={setShowConfirmationModal}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <CardTitle>¿Estás seguro de eliminar este video?</CardTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El video será eliminado
              permanentemente de la base de datos.
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
              className="bg-primary hover:bg-primary/70 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}