"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface AsignarCapacitacionProps {
  capacitacionId: number
  empleados: any[]
  empleadosAsignados: string[]
}

export function AsignarCapacitacion({ capacitacionId, empleados, empleadosAsignados }: AsignarCapacitacionProps) {
  const [selected, setSelected] = useState<string[]>(empleadosAsignados)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const supabase = createClient()

  const handleToggle = (dni: string) => {
    setSelected((prev) => (prev.includes(dni) ? prev.filter((d) => d !== dni) : [...prev, dni]))
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      // Eliminar asignaciones anteriores
      await supabase.from("empleado_capacitacion").delete().eq("id_capacitacion", capacitacionId)

      // Insertar nuevas asignaciones
      if (selected.length > 0) {
        const asignaciones = selected.map((dni) => ({
          dni_empleado: dni,
          id_capacitacion: capacitacionId,
        }))
        const { error } = await supabase.from("empleado_capacitacion").insert(asignaciones)
        if (error) throw error
      }

      toast({ title: "Empleados asignados correctamente" })
      router.push("/dashboard/capacitaciones")
      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Seleccionar Empleados</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="max-h-96 space-y-2 overflow-y-auto">
          {empleados.map((emp) => (
            <div key={emp.dni} className="flex items-center space-x-2">
              <Checkbox
                id={emp.dni}
                checked={selected.includes(emp.dni)}
                onCheckedChange={() => handleToggle(emp.dni)}
              />
              <label htmlFor={emp.dni} className="cursor-pointer text-sm">
                {emp.nombre} {emp.apellido} ({emp.dni})
              </label>
            </div>
          ))}
        </div>

        <div className="flex gap-4">
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Guardando..." : "Guardar Asignaciones"}
          </Button>
          <Button variant="outline" onClick={() => router.back()}>
            Cancelar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
