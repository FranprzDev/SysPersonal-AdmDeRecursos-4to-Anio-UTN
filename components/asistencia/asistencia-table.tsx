"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface EmpleadoConAsistencia {
  dni: string
  nombre: string
  apellido: string
  asistencia: {
    id_asistencia: number
    dni_empleado: string
    fecha: string
    hora_ingreso: string | null
    hora_salida: string | null
  } | null
}

export function AsistenciaTable({ empleadosConAsistencia }: { empleadosConAsistencia: EmpleadoConAsistencia[] }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const formatTime = (dateString: string | null): string => {
    if (!dateString) return "-"
    if (!mounted) return "-"
    try {
      const date = new Date(dateString)
      return date.toLocaleTimeString("es-AR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    } catch {
      return "-"
    }
  }

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
          {empleadosConAsistencia.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-gray-500">
                No hay empleados activos
              </TableCell>
            </TableRow>
          ) : (
            empleadosConAsistencia.map((empleado) => {
              const asistencia = empleado.asistencia
              const tieneAsistencia = asistencia !== null
              const tieneIngreso = asistencia?.hora_ingreso !== null
              const tieneSalida = asistencia?.hora_salida !== null

              return (
                <TableRow key={empleado.dni}>
                  <TableCell>
                    {empleado.nombre} {empleado.apellido}
                  </TableCell>
                  <TableCell>{empleado.dni}</TableCell>
                  <TableCell>{formatTime(asistencia?.hora_ingreso || null)}</TableCell>
                  <TableCell>{formatTime(asistencia?.hora_salida || null)}</TableCell>
                  <TableCell>
                    {tieneAsistencia ? (
                      <Badge variant={tieneSalida ? "default" : "secondary"}>
                        {tieneSalida ? "Completo" : "En curso"}
                      </Badge>
                    ) : (
                      <Badge variant="outline">Sin registrar</Badge>
                    )}
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
    </div>
  )
}
