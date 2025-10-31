"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import type { Permisos } from "@/lib/permissions"

interface SectoresTableProps {
  sectores: any[]
  onEdit: (sector: any) => void
  onDelete: () => void
  permisos: Permisos["sectores"]
}

export function SectoresTable({ sectores, onEdit, onDelete, permisos }: SectoresTableProps) {
  const supabase = createClient()

  const handleDelete = async (id: number) => {
    try {
      const { error } = await supabase.from("sectores").delete().eq("id_sector", id)

      if (error) throw error

      toast({
        title: "Sector eliminado",
        description: "El sector ha sido eliminado correctamente",
      })

      onDelete()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  return (
    <div className="rounded-lg border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead>Supervisor</TableHead>
            {(permisos.editar || permisos.eliminar) && (
              <TableHead className="text-right">Acciones</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sectores.length === 0 ? (
            <TableRow>
              <TableCell colSpan={permisos.editar || permisos.eliminar ? 4 : 3} className="text-center text-gray-500 py-8">
                No hay sectores registrados
              </TableCell>
            </TableRow>
          ) : (
            sectores.map((sector) => (
              <TableRow key={sector.id_sector}>
                <TableCell className="font-medium">{sector.nombre_sector}</TableCell>
                <TableCell>{sector.descripcion || "-"}</TableCell>
                <TableCell>
                  {sector.supervisor ? `${sector.supervisor.nombre} ${sector.supervisor.apellido}` : sector.dni_supervisor || "-"}
                </TableCell>
                {(permisos.editar || permisos.eliminar) && (
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {permisos.editar && (
                        <Button variant="ghost" size="icon" onClick={() => onEdit(sector)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      {permisos.eliminar && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmar eliminación</AlertDialogTitle>
                              <AlertDialogDescription>
                                ¿Está seguro que desea eliminar este sector? Esta acción no se puede deshacer.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(sector.id_sector)}>
                                Confirmar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}