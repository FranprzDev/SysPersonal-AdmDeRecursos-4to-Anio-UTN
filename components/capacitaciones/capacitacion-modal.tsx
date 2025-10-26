"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface CapacitacionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  capacitacion?: any
  onSuccess: () => void
}

export function CapacitacionModal({ open, onOpenChange, capacitacion, onSuccess }: CapacitacionModalProps) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const supabase = createClient()

  const [formData, setFormData] = useState({
    nombre_capacitacion: "",
    institucion: "",
    fecha_inicio: "",
    fecha_fin: "",
    descripcion: "",
  })

  useEffect(() => {
    if (capacitacion) {
      setFormData({
        nombre_capacitacion: capacitacion.nombre_capacitacion || "",
        institucion: capacitacion.institucion || "",
        fecha_inicio: capacitacion.fecha_inicio || "",
        fecha_fin: capacitacion.fecha_fin || "",
        descripcion: capacitacion.descripcion || "",
      })
    } else {
      setFormData({
        nombre_capacitacion: "",
        institucion: "",
        fecha_inicio: "",
        fecha_fin: "",
        descripcion: "",
      })
    }
  }, [capacitacion, open])

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
        toast({ title: "Capacitación actualizada correctamente" })
      } else {
        const { error } = await supabase.from("capacitaciones").insert([formData])
        if (error) throw error
        toast({ title: "Capacitación creada correctamente" })
      }

      onSuccess()
      onOpenChange(false)
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
          <DialogTitle>{capacitacion ? "Editar Capacitación" : "Nueva Capacitación"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-2">
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

            <div className="col-span-2 space-y-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea
                id="descripcion"
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                rows={4}
              />
            </div>
          </div>

          <div className="flex gap-4 justify-end pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Guardando..." : capacitacion ? "Actualizar" : "Crear"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
