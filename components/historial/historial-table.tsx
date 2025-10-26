"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface HistorialTableProps {
  data: any[]
  tipo: "empleado" | "sector"
}

export function HistorialTable({ data, tipo }: HistorialTableProps) {
  return (
    <div className="rounded-lg border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Fecha</TableHead>
            <TableHead>{tipo === "empleado" ? "Empleado" : "Sector"}</TableHead>
            <TableHead>Campo Modificado</TableHead>
            <TableHead>Valor Anterior</TableHead>
            <TableHead>Valor Nuevo</TableHead>
            <TableHead>Usuario</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id_historial}>
              <TableCell>{new Date(item.fecha_modificacion).toLocaleString()}</TableCell>
              <TableCell>
                {tipo === "empleado"
                  ? item.empleado
                    ? `${item.empleado.nombre} ${item.empleado.apellido}`
                    : item.dni_empleado
                  : item.sector?.nombre_sector || item.id_sector}
              </TableCell>
              <TableCell>
                <Badge variant="outline">{item.campo_modificado}</Badge>
              </TableCell>
              <TableCell className="text-red-600">{item.valor_anterior || "-"}</TableCell>
              <TableCell className="text-green-600">{item.valor_nuevo || "-"}</TableCell>
              <TableCell>{item.usuario_modificador}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
