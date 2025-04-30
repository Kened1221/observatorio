import { useRef } from "react";
import { Upload } from "lucide-react";
import toasterCustom from "../toaster-custom";

interface DragDropExcelInputProps {
  file: File | null;
  setFile: (file: File | null) => void;
  placeholderText?: string;
  onFileSelect?: (file: File) => void;
}

export default function DragDropExcelInput({
  file,
  setFile,
  placeholderText = "Arrastra y suelta un archivo Excel (.xlsx, .xls) aquí o haz clic para seleccionar",
  onFileSelect,
}: DragDropExcelInputProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = () => {
    wrapperRef.current?.classList.add("border-blue-500", "bg-blue-50");
  };

  const handleDragLeave = () => {
    wrapperRef.current?.classList.remove("border-blue-500", "bg-blue-50");
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    wrapperRef.current?.classList.remove("border-blue-500", "bg-blue-50");
    const selectedFile = e.dataTransfer.files?.[0] ?? null;
    handleFile(selectedFile);
  };

  const handleFile = (selectedFile: File | null) => {
    if (selectedFile && selectedFile.name.match(/\.(xlsx|xls)$/)) {
      setFile(selectedFile);
      onFileSelect?.(selectedFile);
    } else if (selectedFile) {
      toasterCustom(
        400,
        "Solo se permiten archivos Excel en formato XLSX o XLS."
      );
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] ?? null;
    handleFile(selectedFile);
  };

  return (
    <div
      ref={wrapperRef}
      className={`relative w-full border-dashed border-2 rounded-lg flex items-center justify-center p-6 cursor-pointer transition-colors ${
        file
          ? "border-ring bg-primary/10"
          : "border-primary hover:border-ring hover:bg-primary/10"
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
        accept=".xlsx, .xls"
        className="hidden"
        onChange={handleInputChange}
      />
      <div className="text-center flex flex-col items-center justify-center">
        {file ? (
          <div className="text-center flex flex-col items-center justify-center">
            <Upload className="h-8 w-8 mb-2 text-primary-foreground" />
            <p className="text-sm font-medium text-primary overflow-hidden text-ellipsis whitespace-nowrap max-w-[200px]">
              {file.name}
            </p>
          </div>
        ) : (
          <>
            <Upload className="h-8 w-8 mb-2 text-gray-400" />
            <p className="text-sm text-gray-600 mb-2">{placeholderText}</p>
            <p className="text-xs text-gray-500">
              Solo se permiten archivos XLSX o XLS
            </p>
          </>
        )}
      </div>
    </div>
  );
}