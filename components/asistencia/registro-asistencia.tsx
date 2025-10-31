"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { LogIn, LogOut } from "lucide-react"

interface RegistroAsistenciaProps {
  empleados?: any[]
  dniEmpleadoFijo?: string
  modoEmpleado?: boolean
}

export function RegistroAsistencia({ empleados = [], dniEmpleadoFijo, modoEmpleado = false }: RegistroAsistenciaProps) {
  const dniEmpleado = modoEmpleado ? (dniEmpleadoFijo || "") : ""
  const [dniEmpleadoSeleccionado, setDniEmpleadoSeleccionado] = useState(modoEmpleado ? dniEmpleadoFijo || "" : "")
  const [loading, setLoading] = useState(false)
  
  const router = useRouter()
  const supabase = createClient()

  const dniParaUsar = modoEmpleado ? dniEmpleado : dniEmpleadoSeleccionado

  const marcarIngreso = async () => {
    if (!dniParaUsar) {
      toast.error(modoEmpleado ? "Error: No se pudo identificar su usuario" : "Debe seleccionar un empleado")
      return
    }

    setLoading(true)
    try {
      const hoy = new Date().toISOString().split("T")[0]

      const { data: existente, error: errorExistente } = await supabase
        .from("asistencias")
        .select("*")
        .eq("dni_empleado", dniParaUsar)
        .eq("fecha", hoy)
        .maybeSingle()

      if (errorExistente && errorExistente.code !== "PGRST116") {
        throw errorExistente
      }

      if (existente && existente.hora_ingreso) {
        toast.error("Ya se registró el ingreso para hoy")
        setLoading(false)
        return
      }

      const { error } = await supabase.from("asistencias").insert([
        {
          dni_empleado: dniParaUsar,
          fecha: hoy,
          hora_ingreso: new Date().toISOString(),
        },
      ])

      if (error) throw error

      toast.success("Se ha registrado el ingreso correctamente")

      if (!modoEmpleado) {
        setDniEmpleadoSeleccionado("")
      }
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || "Error al registrar el ingreso")
    } finally {
      setLoading(false)
    }
  }

  const marcarSalida = async () => {
    if (!dniParaUsar) {
      toast.error(modoEmpleado ? "Error: No se pudo identificar su usuario" : "Debe seleccionar un empleado")
      return
    }

    setLoading(true)
    try {
      const hoy = new Date().toISOString().split("T")[0]

      const { data: existente, error: errorExistente } = await supabase
        .from("asistencias")
        .select("*")
        .eq("dni_empleado", dniParaUsar)
        .eq("fecha", hoy)
        .maybeSingle()

      if (errorExistente && errorExistente.code !== "PGRST116") {
        throw errorExistente
      }

      if (!existente || !existente.hora_ingreso) {
        toast.error("Debe registrar el ingreso primero")
        setLoading(false)
        return
      }

      if (existente.hora_salida) {
        toast.error("Ya se registró la salida para hoy")
        setLoading(false)
        return
      }

      const { error } = await supabase
        .from("asistencias")
        .update({ hora_salida: new Date().toISOString() })
        .eq("id_asistencia", existente.id_asistencia)

      if (error) throw error

      toast.success("Se ha registrado la salida correctamente")

      if (!modoEmpleado) {
        setDniEmpleadoSeleccionado("")
      }
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || "Error al registrar la salida")
    } finally {
      setLoading(false)
    }
  }

  if (modoEmpleado && !dniEmpleadoFijo) {
    return (
      <div className="p-4 text-center text-gray-500">
        Error: No se pudo identificar su usuario. Por favor, contacte al administrador.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {!modoEmpleado && (
        <div className="space-y-2">
          <Label htmlFor="empleado">Seleccionar Empleado</Label>
          <Select value={dniEmpleadoSeleccionado} onValueChange={setDniEmpleadoSeleccionado}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar empleado" />
            </SelectTrigger>
            <SelectContent>
              {empleados.map((emp) => (
                <SelectItem key={emp.dni} value={emp.dni}>
                  {emp.nombre} {emp.apellido} ({emp.dni})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {modoEmpleado && (
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800 font-medium">
            Registrando asistencia para: {empleados[0]?.nombre} {empleados[0]?.apellido}
          </p>
        </div>
      )}

      <div className="flex gap-4">
        <Button onClick={marcarIngreso} disabled={loading || !dniParaUsar} className="flex-1">
          <LogIn className="mr-2 h-4 w-4" />
          Marcar Ingreso
        </Button>
        <Button onClick={marcarSalida} disabled={loading || !dniParaUsar} variant="outline" className="flex-1 bg-transparent">
          <LogOut className="mr-2 h-4 w-4" />
          Marcar Salida
        </Button>
      </div>
    </div>
  )
}
