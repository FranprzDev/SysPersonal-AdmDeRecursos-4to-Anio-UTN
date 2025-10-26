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

interface RolModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  rol?: any
  onSuccess: () => void
}

export function RolModal({ open, onOpenChange, rol, onSuccess }: RolModalProps) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const supabase = createClient()

  const [formData, setFormData] = useState({
    nombre_rol: "",
    descripcion: "",
  })

  useEffect(() => {
    if (rol) {
      setFormData({
        nombre_rol: rol.nombre_rol || "",
        descripcion: rol.descripcion || "",
      })
    } else {
      setFormData({
        nombre_rol: "",
        descripcion: "",
      })
    }
  }, [rol, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (rol) {
        const { error } = await supabase.from("roles").update(formData).eq("id_rol", rol.id_rol)
        if (error) throw error
        toast({ title: "Rol actualizado correctamente" })
      } else {
        const { error } = await supabase.from("roles").insert([formData])
        if (error) throw error
        toast({ title: "Rol creado correctamente" })
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
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{rol ? "Editar Rol" : "Nuevo Rol"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nombre_rol">Nombre del Rol *</Label>
            <Input
              id="nombre_rol"
              value={formData.nombre_rol}
              onChange={(e) => setFormData({ ...formData, nombre_rol: e.target.value })}
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

          <div className="flex gap-4 justify-end pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Guardando..." : rol ? "Actualizar" : "Crear"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
