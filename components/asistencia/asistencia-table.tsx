"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export function AsistenciaTable({ asistencias }: { asistencias: any[] }) {
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Empleado</TableHead>
            <TableHead>DNI</TableHead>
            <TableHead>Hora Ingreso</TableHead>
            <TableHead>Hora Salida</TableHead>
            <TableHead>Estado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {asistencias.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-gray-500">
                No hay registros de asistencia para hoy
              </TableCell>
            </TableRow>
          ) : (
            asistencias.map((asistencia) => (
              <TableRow key={asistencia.id_asistencia}>
                <TableCell>
                  {asistencia.empleado
                    ? `${asistencia.empleado.nombre} ${asistencia.empleado.apellido}`
                    : asistencia.dni_empleado}
                </TableCell>
                <TableCell>{asistencia.dni_empleado}</TableCell>
                <TableCell>
                  {asistencia.hora_ingreso ? new Date(asistencia.hora_ingreso).toLocaleTimeString() : "-"}
                </TableCell>
                <TableCell>
                  {asistencia.hora_salida ? new Date(asistencia.hora_salida).toLocaleTimeString() : "-"}
                </TableCell>
                <TableCell>
                  <Badge variant={asistencia.hora_salida ? "default" : "secondary"}>
                    {asistencia.hora_salida ? "Completo" : "En curso"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
