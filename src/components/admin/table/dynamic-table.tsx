"use client";

import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Filter,
  FilterX,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Tipos para las columnas y datos
interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
  filterable?: boolean;
  getFilterValue?: (row: T) => string;
}

interface DynamicTableProps<T> {
  data: T[];
  columns: Column<T>[];
  actions?: {
    label: string;
    onClick: (row: T) => void;
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost";
    icon?: React.ReactNode;
  }[];
  itemsPerPage?: number;
  emptyMessage?: string;
}

function DynamicTable<T>({
  data,
  columns,
  actions = [],
  itemsPerPage = 10,
  emptyMessage = "No hay datos disponibles",
}: DynamicTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<Record<string, string | null>>(
    columns.reduce((acc, col) => ({ ...acc, [col.key]: null }), {})
  );

  // Obtener valores únicos para cada columna
  const uniqueValues = useMemo(() => {
    const values: Record<string, Set<string>> = {};
    columns.forEach((column) => {
      if (column.filterable) {
        values[column.key] = new Set(
          data.map((row) => {
            if (column.getFilterValue) {
              return column.getFilterValue(row);
            }
            return column.render
              ? String(column.render(row))
              : String(row[column.key as keyof T]);
          })
        );
      }
    });
    return values;
  }, [data, columns]);

  // Filtrar datos según los valores seleccionados
  const filteredData = useMemo(() => {
    return data.filter((row) =>
      columns.every((column) => {
        if (!column.filterable || filters[column.key] === null) return true;
        const value = column.getFilterValue
          ? column.getFilterValue(row)
          : column.render
          ? String(column.render(row))
          : String(row[column.key as keyof T]);
        return value === filters[column.key];
      })
    );
  }, [data, columns, filters]);

  // Calcular paginación sobre los datos filtrados
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedData = filteredData.slice(startIndex, endIndex);

  // Funciones de paginación
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const nextPage = () => goToPage(currentPage + 1);
  const prevPage = () => goToPage(currentPage - 1);
  const firstPage = () => goToPage(1);
  const lastPage = () => goToPage(totalPages);

  // Manejar cambios en los filtros
  const handleFilterChange = (key: string, value: string | null) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reiniciar a la primera página al filtrar
  };

  return (
    <div className="w-full">
      {/* Tabla */}
      <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              {columns.map((column) => (
                <TableHead
                  key={column.key}
                  className={cn(
                    "text-xs font-semibold uppercase text-muted-foreground",
                    column.className
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span>{column.header}</span>
                    {column.filterable && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-0 h-auto"
                          >
                            {filters[column.key] ? (
                              <FilterX className="h-4 w-4 text-primary" />
                            ) : (
                              <Filter className="h-4 w-4" />
                            )}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={() => handleFilterChange(column.key, null)}
                          >
                            Todos
                          </DropdownMenuItem>
                          {Array.from(uniqueValues[column.key] || []).map(
                            (value) => (
                              <DropdownMenuItem
                                key={value}
                                onClick={() =>
                                  handleFilterChange(column.key, value)
                                }
                              >
                                {value}
                              </DropdownMenuItem>
                            )
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </TableHead>
              ))}
              {actions.length > 0 && (
                <TableHead className="text-xs font-semibold uppercase text-muted-foreground">
                  Acciones
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIndex) => (
                <TableRow
                  key={rowIndex}
                  className="hover:bg-muted/50 transition-colors"
                >
                  {columns.map((column) => (
                    <TableCell
                      key={column.key}
                      className={cn("text-sm", column.className)}
                    >
                      {column.render
                        ? column.render(row)
                        : (row[column.key as keyof T] as React.ReactNode)}
                    </TableCell>
                  ))}
                  {actions.length > 0 && (
                    <TableCell className="flex gap-2">
                      {actions.map((action, actionIndex) => (
                        <Button
                          key={actionIndex}
                          variant={action.variant || "outline"}
                          size="sm"
                          onClick={() => action.onClick(row)}
                          className="flex items-center gap-1"
                        >
                          {action.icon && action.icon}
                          {action.label}
                        </Button>
                      ))}
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (actions.length > 0 ? 1 : 0)}
                  className="text-center py-8 text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginación */}
      {totalItems > itemsPerPage && (
        <div className="flex items-center justify-between px-4 py-3 bg-card border-t border-border">
          <div className="text-sm text-muted-foreground">
            Mostrando {startIndex + 1}-{endIndex} de {totalItems} elementos
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={firstPage}
              disabled={currentPage === 1}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={prevPage}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              Página {currentPage} de {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={nextPage}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={lastPage}
              disabled={currentPage === totalPages}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DynamicTable;