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
  empleados: any[]
}

export function RegistroAsistencia({ empleados }: RegistroAsistenciaProps) {
  const [dniEmpleado, setDniEmpleado] = useState("")
  const [loading, setLoading] = useState(false)
  
  const router = useRouter()
  const supabase = createClient()

  const marcarIngreso = async () => {
    if (!dniEmpleado) {
      toast.error("Debe seleccionar un empleado")
      return
    }

    setLoading(true)
    try {
      const hoy = new Date().toISOString().split("T")[0]

      const { data: existente, error: errorExistente } = await supabase
        .from("asistencias")
        .select("*")
        .eq("dni_empleado", dniEmpleado)
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
          dni_empleado: dniEmpleado,
          fecha: hoy,
          hora_ingreso: new Date().toISOString(),
        },
      ])

      if (error) throw error

      toast.success("Se ha registrado el ingreso correctamente")

      setDniEmpleado("")
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || "Error al registrar el ingreso")
    } finally {
      setLoading(false)
    }
  }

  const marcarSalida = async () => {
    if (!dniEmpleado) {
      toast.error("Debe seleccionar un empleado")
      return
    }

    setLoading(true)
    try {
      const hoy = new Date().toISOString().split("T")[0]

      const { data: existente, error: errorExistente } = await supabase
        .from("asistencias")
        .select("*")
        .eq("dni_empleado", dniEmpleado)
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

      setDniEmpleado("")
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || "Error al registrar la salida")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="empleado">Seleccionar Empleado</Label>
        <Select value={dniEmpleado} onValueChange={setDniEmpleado}>
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

      <div className="flex gap-4">
        <Button onClick={marcarIngreso} disabled={loading} className="flex-1">
          <LogIn className="mr-2 h-4 w-4" />
          Marcar Ingreso
        </Button>
        <Button onClick={marcarSalida} disabled={loading} variant="outline" className="flex-1 bg-transparent">
          <LogOut className="mr-2 h-4 w-4" />
          Marcar Salida
        </Button>
      </div>
    </div>
  )
}
