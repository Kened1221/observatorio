import { ColumnDef } from "@tanstack/react-table";
import { FileSpreadsheet } from "lucide-react";

export interface PdfRow {
  id: number;
  fileName: string;
  title: string;
  description: string;
  category: "normas" | "informes";
  uploadedAt: string;
  file: File;
}

export const columns: ColumnDef<PdfRow>[] = [
  {
    accessorKey: "fileName",
    header: "Nombre del Archivo",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">{row.original.fileName}</span>
      </div>
    ),
  },
  {
    accessorKey: "title",
    header: "Título",
    cell: ({ row }) => <span className="text-sm">{row.original.title}</span>,
  },
  {
    accessorKey: "description",
    header: "Descripción",
    cell: ({ row }) => (
      <span className="text-sm">{row.original.description}</span>
    ),
  },
  {
    accessorKey: "category",
    header: "Categoría",
    cell: ({ row }) => (
      <span className="text-sm capitalize">
        {row.original.category === "normas" ? "Normas" : "Informes"}
      </span>
    ),
  },
  {
    accessorKey: "uploadedAt",
    header: "Fecha de Carga",
    cell: ({ row }) => (
      <span className="text-sm">{row.original.uploadedAt}</span>
    ),
  },
  {
    accessorKey: "file",
    header: "Acción",
    cell: ({ row }) => (
      <a
        href={URL.createObjectURL(row.original.file)}
        download={row.original.fileName}
        className="text-primary hover:underline"
      >
        Descargar
      </a>
    ),
  },
];
