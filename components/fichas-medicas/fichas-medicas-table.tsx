"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2 } from "lucide-react"
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

interface FichasMedicasTableProps {
  fichas: any[]
  onEdit: (ficha: any) => void
  onDelete: (id: number) => void
  permisos: Permisos["fichasMedicas"]
}

export function FichasMedicasTable({ fichas, onEdit, onDelete, permisos }: FichasMedicasTableProps) {
  return (
    <div className="rounded-lg border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Empleado</TableHead>
            <TableHead>DNI</TableHead>
            <TableHead>Grupo Sanguíneo</TableHead>
            <TableHead>Aptitud Médica</TableHead>
            <TableHead>Fecha Control</TableHead>
            {(permisos.editar || permisos.eliminar) && (
              <TableHead className="text-right">Acciones</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {fichas.map((ficha) => (
            <TableRow key={ficha.id_ficha}>
              <TableCell className="font-medium">
                {ficha.empleado ? `${ficha.empleado.nombre} ${ficha.empleado.apellido}` : "-"}
              </TableCell>
              <TableCell>{ficha.dni_empleado}</TableCell>
              <TableCell>{ficha.grupo_sanguineo || "-"}</TableCell>
              <TableCell>
                <Badge variant={ficha.aptitud_medica === "Apto" ? "default" : "destructive"}>
                  {ficha.aptitud_medica || "-"}
                </Badge>
              </TableCell>
              <TableCell>{ficha.fecha_control ? new Date(ficha.fecha_control).toLocaleDateString() : "-"}</TableCell>
              {(permisos.editar || permisos.eliminar) && (
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {permisos.editar && (
                      <Button variant="ghost" size="icon" onClick={() => onEdit(ficha)}>
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
                              ¿Está seguro que desea eliminar esta ficha médica? Esta acción se puede revertir.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => onDelete(ficha.id_ficha)}>
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
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
