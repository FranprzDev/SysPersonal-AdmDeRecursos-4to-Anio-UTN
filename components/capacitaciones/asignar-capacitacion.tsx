"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Search } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface AsignarCapacitacionProps {
  capacitacionId: number
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

interface Empleado {
  dni: string
  nombre: string
  apellido: string
}

export function AsignarCapacitacion({ capacitacionId, open, onOpenChange, onSuccess }: AsignarCapacitacionProps) {
  const [empleados, setEmpleados] = useState<Empleado[]>([])
  const [empleadosAsignados, setEmpleadosAsignados] = useState<string[]>([])
  const [capacitacion, setCapacitacion] = useState<any>(null)
  const [selected, setSelected] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [loadingData, setLoadingData] = useState<boolean>(true)
  const { toast } = useToast()
  const supabase = createClient()

  useEffect(() => {
    if (!open) return

    const loadData = async () => {
      setLoadingData(true)
      try {
        const { data: capacitacionData } = await supabase
          .from("capacitaciones")
          .select("*")
          .eq("id_capacitacion", capacitacionId)
          .single()

        if (!capacitacionData) {
          toast({
            title: "Error",
            description: "Capacitación no encontrada",
            variant: "destructive",
          })
          onOpenChange(false)
          return
        }

        setCapacitacion(capacitacionData)

        const { data: empleadosData } = await supabase
          .from("empleados")
          .select("dni, nombre, apellido")
          .eq("activo", true)
          .order("apellido")

        const { data: asignadosData } = await supabase
          .from("empleado_capacitacion")
          .select("dni_empleado")
          .eq("id_capacitacion", capacitacionId)

        const asignados = asignadosData?.map((a) => a.dni_empleado) || []

        setEmpleados(empleadosData || [])
        setEmpleadosAsignados(asignados)
        setSelected(asignados)
        setSearchTerm("")
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        })
      } finally {
        setLoadingData(false)
      }
    }

    loadData()
  }, [capacitacionId, open, supabase, toast, onOpenChange])

  const filteredEmpleados = empleados.filter((emp) => {
    const fullName = `${emp.nombre} ${emp.apellido}`.toLowerCase()
    const searchLower = searchTerm.toLowerCase()
    return (
      fullName.includes(searchLower) ||
      emp.dni.includes(searchTerm) ||
      emp.nombre.toLowerCase().includes(searchLower) ||
      emp.apellido.toLowerCase().includes(searchLower)
    )
  })

  const handleToggle = (dni: string) => {
    setSelected((prev) => (prev.includes(dni) ? prev.filter((d) => d !== dni) : [...prev, dni]))
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      await supabase.from("empleado_capacitacion").delete().eq("id_capacitacion", capacitacionId)

      if (selected.length > 0) {
        const asignaciones = selected.map((dni) => ({
          dni_empleado: dni,
          id_capacitacion: capacitacionId,
        }))
        const { error } = await supabase.from("empleado_capacitacion").insert(asignaciones)
        if (error) throw error
      }

      toast({ title: "Empleados asignados correctamente" })
      onOpenChange(false)
      if (onSuccess) onSuccess()
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Asignar Empleados</DialogTitle>
          {capacitacion && <p className="text-sm text-gray-500">{capacitacion.nombre_capacitacion}</p>}
        </DialogHeader>
        <div className="space-y-4">
          {loadingData ? (
            <div className="py-8 text-center text-gray-500">Cargando...</div>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <Search className="h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Buscar por nombre, apellido o DNI..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>

              <div className="max-h-96 space-y-2 overflow-y-auto">
                {filteredEmpleados.length === 0 ? (
                  <div className="py-8 text-center text-gray-500">
                    {searchTerm ? "No se encontraron empleados con ese criterio" : "No hay empleados disponibles"}
                  </div>
                ) : (
                  filteredEmpleados.map((emp) => (
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
                  ))
                )}
              </div>

              <div className="flex gap-4 justify-end pt-4">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSave} disabled={loading}>
                  {loading ? "Guardando..." : "Guardar Asignaciones"}
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
