"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

interface CapacitacionFormProps {
  capacitacion?: any
}

export function CapacitacionForm({ capacitacion }: CapacitacionFormProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  
  const supabase = createClient()

  const [formData, setFormData] = useState({
    nombre_capacitacion: capacitacion?.nombre_capacitacion || "",
    institucion: capacitacion?.institucion || "",
    fecha_inicio: capacitacion?.fecha_inicio || "",
    fecha_fin: capacitacion?.fecha_fin || "",
    descripcion: capacitacion?.descripcion || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (capacitacion) {
        const { error } = await supabase
          .from("capacitaciones")
          .update(formData)
          .eq("id_capacitacion", capacitacion.id_capacitacion)
        if (error) throw error
        toast.success("Capacitación actualizada correctamente")
      } else {
        const { error } = await supabase.from("capacitaciones").insert([formData])
        if (error) throw error
        toast.success("Capacitación creada correctamente")
      }

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
        <CardTitle>Información de la Capacitación</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="nombre_capacitacion">Nombre de la Capacitación *</Label>
            <Input
              id="nombre_capacitacion"
              value={formData.nombre_capacitacion}
              onChange={(e) => setFormData({ ...formData, nombre_capacitacion: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="institucion">Institución</Label>
            <Input
              id="institucion"
              value={formData.institucion}
              onChange={(e) => setFormData({ ...formData, institucion: e.target.value })}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fecha_inicio">Fecha de Inicio</Label>
              <Input
                id="fecha_inicio"
                type="date"
                value={formData.fecha_inicio}
                onChange={(e) => setFormData({ ...formData, fecha_inicio: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fecha_fin">Fecha de Fin</Label>
              <Input
                id="fecha_fin"
                type="date"
                value={formData.fecha_fin}
                onChange={(e) => setFormData({ ...formData, fecha_fin: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              rows={4}
            />
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={loading}>
              {loading ? "Guardando..." : capacitacion ? "Actualizar" : "Crear"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
