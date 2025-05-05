import { ColumnDef } from "@tanstack/react-table";

export interface PdfRow {
  id: number;
  fileName: string;
  category: "normas" | "informes";
  uploadedAt: string;
  file: File;
}

export const columns: ColumnDef<PdfRow>[] = [
  {
    accessorKey: "fileName",
    header: "Nombre del Archivo",
    cell: ({ row }) => (
      <span className="text-sm font-medium">{row.original.fileName}</span>
    ),
  },
  {
    accessorKey: "category",
    header: "Categoría",
    cell: ({ row }) => (
      <span className="text-sm capitalize">{row.original.category}</span>
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