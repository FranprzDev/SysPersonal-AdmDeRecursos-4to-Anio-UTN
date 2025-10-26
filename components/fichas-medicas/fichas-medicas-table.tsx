"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit } from "lucide-react"

interface FichasMedicasTableProps {
  fichas: any[]
  onEdit: (ficha: any) => void
}

export function FichasMedicasTable({ fichas, onEdit }: FichasMedicasTableProps) {
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
            <TableHead className="text-right">Acciones</TableHead>
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
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" onClick={() => onEdit(ficha)}>
                  <Edit className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
