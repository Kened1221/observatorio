"use client";

import { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DragDropPdfInput from "@/components/ui/drag-drop-pdf-input";
import toasterCustom from "@/components/toaster-custom";
import { Search, ArrowUpDown, FileSpreadsheet } from "lucide-react";
import { PdfRow, columns } from "./table-columns";

export default function Page() {
  const [normasPdf, setNormasPdf] = useState<File | null>(null);
  const [normasTitle, setNormasTitle] = useState<string>("");
  const [normasDescription, setNormasDescription] = useState<string>("");
  const [informesPdf, setInformesPdf] = useState<File | null>(null);
  const [informesTitle, setInformesTitle] = useState<string>("");
  const [informesDescription, setInformesDescription] = useState<string>("");
  const [uploadedFiles, setUploadedFiles] = useState<PdfRow[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const handleUpload = (pdf: File | null, title: string, description: string, category: "normas" | "informes") => {
    if (!pdf) {
      toasterCustom(400, "Por favor, selecciona un archivo PDF primero.");
      return;
    }
    if (!title.trim()) {
      toasterCustom(400, "Por favor, ingresa un título para el archivo.");
      return;
    }
    if (!description.trim()) {
      toasterCustom(400, "Por favor, ingresa una descripción para el archivo.");
      return;
    }
    setUploadedFiles((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        fileName: pdf.name,
        title: title.trim(),
        description: description.trim(),
        category,
        uploadedAt: new Date().toLocaleDateString("es-ES", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
        file: pdf,
      },
    ]);
    if (category === "normas") {
      setNormasPdf(null);
      setNormasTitle("");
      setNormasDescription("");
    } else {
      setInformesPdf(null);
      setInformesTitle("");
      setInformesDescription("");
    }
  };

  const handleCancel = (category: "normas" | "informes") => {
    if (category === "normas") {
      setNormasPdf(null);
      setNormasTitle("");
      setNormasDescription("");
    } else {
      setInformesPdf(null);
      setInformesTitle("");
      setInformesDescription("");
    }
  };

  const handleSort = () => {
    setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
  };

  const filteredFiles = useMemo(() => {
    return uploadedFiles.filter(
      (file) =>
        file.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        file.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        file.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        file.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [uploadedFiles, searchQuery]);

  const sortedFiles = useMemo(() => {
    return [...filteredFiles].sort((a, b) => {
      const dateA = new Date(a.uploadedAt.split("/").reverse().join("-")).getTime();
      const dateB = new Date(b.uploadedAt.split("/").reverse().join("-")).getTime();
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });
  }, [filteredFiles, sortOrder]);

  const table = useReactTable({
    data: sortedFiles,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Subir Documentos PDF</h1>
      <Tabs defaultValue="normas" className="mb-8">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="normas">Normas</TabsTrigger>
          <TabsTrigger value="informes">Informes</TabsTrigger>
        </TabsList>
        <TabsContent value="normas">
          <Card>
            <CardHeader>
              <CardTitle>Subir Normas</CardTitle>
            </CardHeader>
            <CardContent>
              <DragDropPdfInput
                pdf={normasPdf}
                setPdf={setNormasPdf}
                category="normas"
              />
              <div className="mt-4 space-y-4">
                <div>
                  <Label htmlFor="normas-title">Título</Label>
                  <Input
                    id="normas-title"
                    value={normasTitle}
                    onChange={(e) => setNormasTitle(e.target.value)}
                    placeholder="Ingresa el título del documento"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="normas-description">Descripción</Label>
                  <Textarea
                    id="normas-description"
                    value={normasDescription}
                    onChange={(e) => setNormasDescription(e.target.value)}
                    placeholder="Ingresa una breve descripción del documento"
                    className="mt-1"
                    rows={4}
                  />
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button
                  className="w-full"
                  onClick={() => handleUpload(normasPdf, normasTitle, normasDescription, "normas")}
                  disabled={!normasPdf || !normasTitle.trim() || !normasDescription.trim()}
                >
                  Guardar
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleCancel("normas")}
                  disabled={!normasPdf && !normasTitle && !normasDescription}
                >
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="informes">
          <Card>
            <CardHeader>
              <CardTitle>Subir Informes</CardTitle>
            </CardHeader>
            <CardContent>
              <DragDropPdfInput
                pdf={informesPdf}
                setPdf={setInformesPdf}
                category="informes"
              />
              <div className="mt-4 space-y-4">
                <div>
                  <Label htmlFor="informes-title">Título</Label>
                  <Input
                    id="informes-title"
                    value={informesTitle}
                    onChange={(e) => setInformesTitle(e.target.value)}
                    placeholder="Ingresa el título del documento"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="informes-description">Descripción</Label>
                  <Textarea
                    id="informes-description"
                    value={informesDescription}
                    onChange={(e) => setInformesDescription(e.target.value)}
                    placeholder="Ingresa una breve descripción del documento"
                    className="mt-1"
                    rows={4}
                  />
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button
                  className="w-full"
                  onClick={() => handleUpload(informesPdf, informesTitle, informesDescription, "informes")}
                  disabled={!informesPdf || !informesTitle.trim() || !informesDescription.trim()}
                >
                  Guardar
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleCancel("informes")}
                  disabled={!informesPdf && !informesTitle && !informesDescription}
                >
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <Card className="border-none shadow-lg">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-t-lg">
          <CardTitle className="text-2xl font-semibold text-gray-900">
            Archivos Subidos
          </CardTitle>
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por nombre, título, descripción o categoría..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 text-sm border-gray-200 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {sortedFiles.length === 0 ? (
            <div className="text-center py-8">
              <FileSpreadsheet className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-muted-foreground">
                {searchQuery
                  ? "No se encontraron archivos que coincidan con la búsqueda."
                  : "No se han subido archivos aún."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          className="border-b p-3 text-left text-sm font-semibold text-muted-foreground bg-gray-50"
                        >
                          {header.column.id === "uploadedAt" ? (
                            <div
                              className="flex items-center cursor-pointer"
                              onClick={handleSort}
                            >
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                              <ArrowUpDown className="ml-2 h-4 w-4" />
                            </div>
                          ) : (
                            flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )
                          )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50">
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="border-b p-3 text-sm">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}