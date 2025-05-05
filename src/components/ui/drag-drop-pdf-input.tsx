import { useRef, useEffect, useState } from "react";
import { FileText } from "lucide-react";
import toasterCustom from "../toaster-custom";

interface DragDropPdfInputProps {
  pdf: File | null | undefined;
  setPdf: (pdf: File | null) => void;
  category: "normas" | "informes";
  placeholderText?: string;
}

export default function DragDropPdfInput({
  pdf,
  setPdf,
  placeholderText = "Arrastra y suelta un PDF aquí o haz clic para seleccionar",
}: DragDropPdfInputProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (pdf) {
      const url = URL.createObjectURL(pdf);
      setPreviewUrl(url);
      return () => {
        URL.revokeObjectURL(url);
        setPreviewUrl(null);
      };
    } else {
      setPreviewUrl(null);
    }
  }, [pdf]);

  const handleDragEnter = () => {
    wrapperRef.current?.classList.add("border-primary", "bg-primary/10");
  };

  const handleDragLeave = () => {
    wrapperRef.current?.classList.remove("border-primary", "bg-primary/10");
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    wrapperRef.current?.classList.remove("border-primary", "bg-primary/10");
    const selectedPdf = e.dataTransfer.files?.[0] ?? null;
    handleFile(selectedPdf);
  };

  const handleFile = (file: File | null) => {
    if (file && file.type === "application/pdf") {
      setPdf(file);
    } else if (file) {
      toasterCustom(400, "Solo se permiten archivos en formato PDF.");
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedPdf = e.target.files?.[0] ?? null;
    handleFile(selectedPdf);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
      <div
        ref={wrapperRef}
        className={`relative w-full border-dashed border-2 rounded-lg flex items-center justify-center p-4 cursor-pointer transition-all duration-200 ${
          pdf
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary hover:bg-primary/10"
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={handleClick}
      >
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={handleInputChange}
        />
        <div className="text-center flex flex-col items-center justify-center gap-2 w-full">
          {pdf ? (
            <div className="flex flex-col items-center gap-2">
              <FileText className="w-12 h-12 text-primary" />
              <p className="text-sm font-medium text-muted-foreground overflow-hidden text-ellipsis whitespace-nowrap max-w-[200px]">
                {pdf.name}
              </p>
            </div>
          ) : (
            <>
              <FileText className="w-12 h-12 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">{placeholderText}</p>
              <p className="text-xs text-muted-foreground">
                Solo se permiten archivos PDF.
              </p>
            </>
          )}
        </div>
      </div>
      {pdf && previewUrl ? (
        <div className="w-full h-64 border border-gray-200 rounded-md overflow-hidden">
          <iframe
            src={previewUrl}
            title="Vista previa del PDF"
            className="w-full h-full"
          />
        </div>
      ) : (
        <div className="w-full h-64 border border-gray-200 rounded-md flex items-center justify-center text-muted-foreground text-sm">
          No hay PDF seleccionado para previsualizar
        </div>
      )}
    </div>
  );
}
