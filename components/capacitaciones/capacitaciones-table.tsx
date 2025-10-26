"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
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

interface CapacitacionesTableProps {
  capacitaciones: any[]
  onEdit: (capacitacion: any) => void
  onDelete: () => void
}

export function CapacitacionesTable({ capacitaciones, onEdit, onDelete }: CapacitacionesTableProps) {
  const { toast } = useToast()
  const supabase = createClient()

  const handleDelete = async (id: number) => {
    try {
      const { error } = await supabase.from("capacitaciones").delete().eq("id_capacitacion", id)

      if (error) throw error

      toast({
        title: "Capacitación eliminada",
        description: "La capacitación ha sido eliminada correctamente",
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
            <TableHead>Institución</TableHead>
            <TableHead>Fecha Inicio</TableHead>
            <TableHead>Fecha Fin</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {capacitaciones.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                No hay capacitaciones registradas
              </TableCell>
            </TableRow>
          ) : (
            capacitaciones.map((cap) => (
              <TableRow key={cap.id_capacitacion}>
                <TableCell className="font-medium">{cap.nombre_capacitacion}</TableCell>
                <TableCell>{cap.institucion || "-"}</TableCell>
                <TableCell>{cap.fecha_inicio ? new Date(cap.fecha_inicio).toLocaleDateString() : "-"}</TableCell>
                <TableCell>{cap.fecha_fin ? new Date(cap.fecha_fin).toLocaleDateString() : "-"}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(cap)}>
                      <Edit className="h-4 w-4" />
                    </Button>
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
                            ¿Está seguro que desea eliminar esta capacitación? Esta acción no se puede deshacer.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(cap.id_capacitacion)}>
                            Confirmar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
