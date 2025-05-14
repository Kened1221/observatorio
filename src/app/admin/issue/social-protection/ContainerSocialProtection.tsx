/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, ArrowUpDown, FileSpreadsheet } from "lucide-react";

// Define the structure for table rows
interface ExcelRow {
  id: number;
  fileName: string;
  category: "pobreza_vulnerabilidad" | "programas_sociales";
  subCategory: string;
  uploadedAt: string;
}

// Define table columns
const columns = [
  {
    accessorKey: "fileName",
    header: "Nombre del Archivo",
    cell: ({ row }: any) => (
      <div className="flex items-center gap-2">
        <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
        <span>{row.original.fileName}</span>
      </div>
    ),
  },
  {
    accessorKey: "category",
    header: "Categoría",
    cell: ({ row }: any) => {
      switch (row.original.category) {
        case "pobreza_vulnerabilidad":
          return "Pobreza y Vulnerabilidad";
        case "programas_sociales":
          return "Programas Sociales";
        default:
          return row.original.category;
      }
    },
  },
  {
    accessorKey: "subCategory",
    header: "Subcategoría",
    cell: ({ row }: any) => {
      switch (row.original.subCategory) {
        case "pobreza":
          return "Pobreza";
        case "adultos_mayores_riesgo":
          return "Adultos Mayores en Situación de Riesgo";
        case "adultos_mayores_asociaciones":
          return "Asociaciones de Adultos Mayores";
        case "mujeres":
          return "Mujeres";
        case "oredis":
          return "OREDIS";
        case "nino_nina":
          return "Niño Niña";
        case "victimas":
          return "Víctimas";
        case "pueblos_indigenas":
          return "Pueblos Indígenas";
        case "organizaciones_juveniles":
          return "Organizaciones Juveniles";
        case "consejos_juveniles":
          return "Consejos Juveniles";
        case "cunamas":
          return "Cunamás";
        case "juntos":
          return "Juntos";
        case "pension_65":
          return "Pensión 65";
        case "wasi_mikuna":
          return "Wasi Mikuna";
        case "confodes":
          return "Confodes";
        default:
          return row.original.subCategory;
      }
    },
  },
  {
    accessorKey: "uploadedAt",
    header: "Fecha de Subida",
  },
];

interface ContainerSocialProtectionProps {
  uploadedFiles: ExcelRow[];
}

export default function ContainerSocialProtection({
  uploadedFiles,
}: ContainerSocialProtectionProps) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const handleSort = () => {
    setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
  };

  const filteredFiles = useMemo(() => {
    return uploadedFiles.filter((file) => {
      const categoryText =
        file.category === "pobreza_vulnerabilidad"
          ? "pobreza y vulnerabilidad"
          : "programas sociales";
      const subCategoryText =
        file.subCategory === "pobreza"
          ? "pobreza"
          : file.subCategory === "adultos_mayores_riesgo"
          ? "adultos mayores en situación de riesgo"
          : file.subCategory === "adultos_mayores_asociaciones"
          ? "asociaciones de adultos mayores"
          : file.subCategory === "mujeres"
          ? "mujeres"
          : file.subCategory === "oredis"
          ? "oredis"
          : file.subCategory === "nino_nina"
          ? "niño niña"
          : file.subCategory === "victimas"
          ? "víctimas"
          : file.subCategory === "pueblos_indigenas"
          ? "pueblos indígenas"
          : file.subCategory === "organizaciones_juveniles"
          ? "organizaciones juveniles"
          : file.subCategory === "consejos_juveniles"
          ? "consejos juveniles"
          : file.subCategory === "cunamas"
          ? "cunamás"
          : file.subCategory === "juntos"
          ? "juntos"
          : file.subCategory === "pension_65"
          ? "pensión 65"
          : file.subCategory === "wasi_mikuna"
          ? "wasi mikuna"
          : "confodes";
      return (
        file.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        categoryText.toLowerCase().includes(searchQuery.toLowerCase()) ||
        subCategoryText.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [uploadedFiles, searchQuery]);

  const sortedFiles = useMemo(() => {
    return [...filteredFiles].sort((a, b) => {
      const dateA = new Date(a.uploadedAt).getTime();
      const dateB = new Date(b.uploadedAt).getTime();
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });
  }, [filteredFiles, sortOrder]);

  const table = useReactTable({
    data: sortedFiles,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Card className="border-none shadow-lg">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-t-lg">
        <CardTitle className="text-2xl font-semibold text-gray-900">
          Archivos Subidos
        </CardTitle>
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar por nombre, categoría o subcategoría..."
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
                        className="border-b p-4 text-left text-sm font-semibold text-gray-600 bg-gray-100"
                      >
                        {header.column.id === "uploadedAt" ? (
                          <div
                            className="flex items-center cursor-pointer hover:text-gray-900"
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
                  <tr
                    key={row.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="border-b p-4 text-sm text-gray-700"
                      >
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
  );
}
