"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import DragDropExcelInput from "@/components/ui/drag-drop-excel-input";

interface SocialProgramsProps {
  programasSocialesExcel: { [key: string]: File | null };
  setProgramasSocialesExcel: React.Dispatch<
    React.SetStateAction<{ [key: string]: File | null }>
  >;
  uploading: boolean;
  setShowConfirmationModal: React.Dispatch<
    React.SetStateAction<{
      isOpen: boolean;
      category: "pobreza_vulnerabilidad" | "programas_sociales" | null;
      subCategory: string | null;
    }>
  >;
}

export default function SocialPrograms({
  programasSocialesExcel,
  setProgramasSocialesExcel,
  uploading,
  setShowConfirmationModal,
}: SocialProgramsProps) {
  const handleCancel = (subCategory: string) => {
    setProgramasSocialesExcel((prev) => ({
      ...prev,
      [subCategory]: null,
    }));
  };

  const handleOpenConfirmationModal = (subCategory: string) => {
    if (programasSocialesExcel[subCategory]) {
      setShowConfirmationModal({
        isOpen: true,
        category: "programas_sociales",
        subCategory,
      });
    }
  };

  return (
    <Tabs defaultValue="cunamas">
      <TabsList className="grid w-full grid-cols-5 gap-2 mb-6">
        <TabsTrigger value="cunamas">Cunamás</TabsTrigger>
        <TabsTrigger value="juntos">Juntos</TabsTrigger>
        <TabsTrigger value="pension_65">Pensión 65</TabsTrigger>
        <TabsTrigger value="wasi_mikuna">Wasi Mikuna</TabsTrigger>
        <TabsTrigger value="confodes">Confodes</TabsTrigger>
      </TabsList>
      <TabsContent value="cunamas">
        <DragDropExcelInput
          file={programasSocialesExcel.cunamas}
          setFile={(file) =>
            setProgramasSocialesExcel((prev) => ({
              ...prev,
              cunamas: file,
            }))
          }
          onFileSelect={(file) =>
            setProgramasSocialesExcel((prev) => ({
              ...prev,
              cunamas: file,
            }))
          }
          placeholderText="Arrastra y suelta un archivo Excel (.xlsx, .xls) con datos de Cunamás"
        />
        <div className="mt-6 flex gap-4">
          <Button
            className="w-full bg-red-600 hover:bg-red-700 text-white"
            onClick={() => handleOpenConfirmationModal("cunamas")}
            disabled={!programasSocialesExcel.cunamas || uploading}
          >
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            {uploading ? "Subiendo..." : "Guardar"}
          </Button>
          <Button
            variant="outline"
            className="w-full border-red-300 text-red-600 hover:bg-red-50"
            onClick={() => handleCancel("cunamas")}
            disabled={!programasSocialesExcel.cunamas || uploading}
          >
            Cancelar
          </Button>
        </div>
      </TabsContent>
      <TabsContent value="juntos">
        <DragDropExcelInput
          file={programasSocialesExcel.juntos}
          setFile={(file) =>
            setProgramasSocialesExcel((prev) => ({
              ...prev,
              juntos: file,
            }))
          }
          onFileSelect={(file) =>
            setProgramasSocialesExcel((prev) => ({
              ...prev,
              juntos: file,
            }))
          }
          placeholderText="Arrastra y suelta un archivo Excel (.xlsx, .xls) con datos de Juntos"
        />
        <div className="mt-6 flex gap-4">
          <Button
            className="w-full bg-red-600 hover:bg-red-700 text-white"
            onClick={() => handleOpenConfirmationModal("juntos")}
            disabled={!programasSocialesExcel.juntos || uploading}
          >
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            {uploading ? "Subiendo..." : "Guardar"}
          </Button>
          <Button
            variant="outline"
            className="w-full border-red-300 text-red-600 hover:bg-red-50"
            onClick={() => handleCancel("juntos")}
            disabled={!programasSocialesExcel.juntos || uploading}
          >
            Cancelar
          </Button>
        </div>
      </TabsContent>
      <TabsContent value="pension_65">
        <DragDropExcelInput
          file={programasSocialesExcel.pension_65}
          setFile={(file) =>
            setProgramasSocialesExcel((prev) => ({
              ...prev,
              pension_65: file,
            }))
          }
          onFileSelect={(file) =>
            setProgramasSocialesExcel((prev) => ({
              ...prev,
              pension_65: file,
            }))
          }
          placeholderText="Arrastra y suelta un archivo Excel (.xlsx, .xls) con datos de Pensión 65"
        />
        <div className="mt-6 flex gap-4">
          <Button
            className="w-full bg-red-600 hover:bg-red-700 text-white"
            onClick={() => handleOpenConfirmationModal("pension_65")}
            disabled={!programasSocialesExcel.pension_65 || uploading}
          >
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            {uploading ? "Subiendo..." : "Guardar"}
          </Button>
          <Button
            variant="outline"
            className="w-full border-red-300 text-red-600 hover:bg-red-50"
            onClick={() => handleCancel("pension_65")}
            disabled={!programasSocialesExcel.pension_65 || uploading}
          >
            Cancelar
          </Button>
        </div>
      </TabsContent>
      <TabsContent value="wasi_mikuna">
        <DragDropExcelInput
          file={programasSocialesExcel.wasi_mikuna}
          setFile={(file) =>
            setProgramasSocialesExcel((prev) => ({
              ...prev,
              wasi_mikuna: file,
            }))
          }
          onFileSelect={(file) =>
            setProgramasSocialesExcel((prev) => ({
              ...prev,
              wasi_mikuna: file,
            }))
          }
          placeholderText="Arrastra y suelta un archivo Excel (.xlsx, .xls) con datos de Wasi Mikuna"
        />
        <div className="mt-6 flex gap-4">
          <Button
            className="w-full bg-red-600 hover:bg-red-700 text-white"
            onClick={() => handleOpenConfirmationModal("wasi_mikuna")}
            disabled={!programasSocialesExcel.wasi_mikuna || uploading}
          >
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            {uploading ? "Subiendo..." : "Guardar"}
          </Button>
          <Button
            variant="outline"
            className="w-full border-red-300 text-red-600 hover:bg-red-50"
            onClick={() => handleCancel("wasi_mikuna")}
            disabled={!programasSocialesExcel.wasi_mikuna || uploading}
          >
            Cancelar
          </Button>
        </div>
      </TabsContent>
      <TabsContent value="confodes">
        <DragDropExcelInput
          file={programasSocialesExcel.confodes}
          setFile={(file) =>
            setProgramasSocialesExcel((prev) => ({
              ...prev,
              confodes: file,
            }))
          }
          onFileSelect={(file) =>
            setProgramasSocialesExcel((prev) => ({
              ...prev,
              confodes: file,
            }))
          }
          placeholderText="Arrastra y suelta un archivo Excel (.xlsx, .xls) con datos de Confodes"
        />
        <div className="mt-6 flex gap-4">
          <Button
            className="w-full bg-red-600 hover:bg-red-700 text-white"
            onClick={() => handleOpenConfirmationModal("confodes")}
            disabled={!programasSocialesExcel.confodes || uploading}
          >
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            {uploading ? "Subiendo..." : "Guardar"}
          </Button>
          <Button
            variant="outline"
            className="w-full border-red-300 text-red-600 hover:bg-red-50"
            onClick={() => handleCancel("confodes")}
            disabled={!programasSocialesExcel.confodes || uploading}
          >
            Cancelar
          </Button>
        </div>
      </TabsContent>
    </Tabs>
  );
}