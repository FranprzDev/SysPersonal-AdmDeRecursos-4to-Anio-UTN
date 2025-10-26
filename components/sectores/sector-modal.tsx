"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface SectorModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  sector?: any
  onSuccess: () => void
}

export function SectorModal({ open, onOpenChange, sector, onSuccess }: SectorModalProps) {
  const [loading, setLoading] = useState(false)
  const [supervisores, setSupervisores] = useState<any[]>([])
  const { toast } = useToast()
  const supabase = createClient()

  const [formData, setFormData] = useState({
    nombre_sector: "",
    descripcion: "",
    dni_supervisor: "none",
  })

  useEffect(() => {
    if (sector) {
      setFormData({
        nombre_sector: sector.nombre_sector || "",
        descripcion: sector.descripcion || "",
        dni_supervisor: sector.dni_supervisor || "none",
      })
    } else {
      setFormData({
        nombre_sector: "",
        descripcion: "",
        dni_supervisor: "none",
      })
    }
  }, [sector, open])

  useEffect(() => {
    const fetchSupervisores = async () => {
      const { data } = await supabase
        .from("empleados")
        .select("dni, nombre, apellido")
        .eq("activo", true)
        .order("apellido")

      if (data) setSupervisores(data)
    }

    if (open) {
      fetchSupervisores()
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const dataToSave = {
        ...formData,
        dni_supervisor: formData.dni_supervisor === "none" ? null : formData.dni_supervisor,
      }

      if (sector) {
        const { error } = await supabase.from("sectores").update(dataToSave).eq("id_sector", sector.id_sector)

        if (error) throw error

        toast({ title: "Sector actualizado correctamente" })
      } else {
        const { error } = await supabase.from("sectores").insert([dataToSave])

        if (error) throw error

        toast({ title: "Sector creado correctamente" })
      }

      onOpenChange(false)
      onSuccess()
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{sector ? "Editar Sector" : "Nuevo Sector"}</DialogTitle>
          <DialogDescription>
            {sector ? "Modifica los datos del sector" : "Completa los datos para crear un nuevo sector"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nombre_sector">Nombre del Sector *</Label>
            <Input
              id="nombre_sector"
              value={formData.nombre_sector}
              onChange={(e) => setFormData({ ...formData, nombre_sector: e.target.value })}
              required
            />
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

          <div className="space-y-2">
            <Label htmlFor="dni_supervisor">Supervisor del Sector</Label>
            <Select
              value={formData.dni_supervisor}
              onValueChange={(value) => setFormData({ ...formData, dni_supervisor: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar supervisor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Sin supervisor</SelectItem>
                {supervisores.map((sup) => (
                  <SelectItem key={sup.dni} value={sup.dni}>
                    {sup.nombre} {sup.apellido}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-4 justify-end pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Guardando..." : sector ? "Actualizar" : "Crear"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
