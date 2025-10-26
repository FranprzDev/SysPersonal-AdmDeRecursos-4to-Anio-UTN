"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface EmpleadoModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  empleado?: any
  onSuccess: () => void
}

export function EmpleadoModal({ open, onOpenChange, empleado, onSuccess }: EmpleadoModalProps) {
  const [loading, setLoading] = useState(false)
  const [sectores, setSectores] = useState<any[]>([])
  const [supervisores, setSupervisores] = useState<any[]>([])
  const { toast } = useToast()
  const supabase = createClient()

  const [formData, setFormData] = useState({
    dni: "",
    nombre: "",
    apellido: "",
    fecha_nacimiento: "",
    direccion: "",
    telefono: "",
    email: "",
    id_sector: "",
    dni_supervisor: "",
  })

  useEffect(() => {
    if (empleado) {
      setFormData({
        dni: empleado.dni || "",
        nombre: empleado.nombre || "",
        apellido: empleado.apellido || "",
        fecha_nacimiento: empleado.fecha_nacimiento || "",
        direccion: empleado.direccion || "",
        telefono: empleado.telefono || "",
        email: empleado.email || "",
        id_sector: empleado.id_sector?.toString() || "",
        dni_supervisor: empleado.dni_supervisor || "",
      })
    } else {
      setFormData({
        dni: "",
        nombre: "",
        apellido: "",
        fecha_nacimiento: "",
        direccion: "",
        telefono: "",
        email: "",
        id_sector: "",
        dni_supervisor: "",
      })
    }
  }, [empleado, open])

  useEffect(() => {
    if (open) {
      loadData()
    }
  }, [open])

  const loadData = async () => {
    const { data: sectoresData } = await supabase.from("sectores").select("*").order("nombre_sector")
    const { data: supervisoresData } = await supabase
      .from("empleados")
      .select("dni, nombre, apellido")
      .eq("activo", true)
      .order("apellido")

    setSectores(sectoresData || [])
    setSupervisores(supervisoresData || [])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const dataToSave = {
        ...formData,
        id_sector: formData.id_sector ? Number.parseInt(formData.id_sector) : null,
        dni_supervisor: formData.dni_supervisor || null,
        activo: true,
      }

      if (empleado) {
        // Editar
        const { error } = await supabase.from("empleados").update(dataToSave).eq("dni", empleado.dni)
        if (error) throw error
        toast({ title: "Empleado actualizado correctamente" })
      } else {
        // Crear
        const { error } = await supabase.from("empleados").insert([dataToSave])
        if (error) throw error
        toast({ title: "Empleado creado correctamente" })
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{empleado ? "Editar Empleado" : "Nuevo Empleado"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dni">DNI *</Label>
              <Input
                id="dni"
                value={formData.dni}
                onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
                required
                disabled={!!empleado}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre *</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="apellido">Apellido *</Label>
              <Input
                id="apellido"
                value={formData.apellido}
                onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fecha_nacimiento">Fecha de Nacimiento *</Label>
              <Input
                id="fecha_nacimiento"
                type="date"
                value={formData.fecha_nacimiento}
                onChange={(e) => setFormData({ ...formData, fecha_nacimiento: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input
                id="telefono"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label htmlFor="direccion">Dirección</Label>
              <Input
                id="direccion"
                value={formData.direccion}
                onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="id_sector">Sector</Label>
              <Select
                value={formData.id_sector}
                onValueChange={(value) => setFormData({ ...formData, id_sector: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar sector" />
                </SelectTrigger>
                <SelectContent>
                  {sectores.map((sector) => (
                    <SelectItem key={sector.id_sector} value={sector.id_sector.toString()}>
                      {sector.nombre_sector}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dni_supervisor">Supervisor</Label>
              <Select
                value={formData.dni_supervisor}
                onValueChange={(value) => setFormData({ ...formData, dni_supervisor: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar supervisor" />
                </SelectTrigger>
                <SelectContent>
                  {supervisores.map((sup) => (
                    <SelectItem key={sup.dni} value={sup.dni}>
                      {sup.apellido}, {sup.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Guardando..." : empleado ? "Actualizar" : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
