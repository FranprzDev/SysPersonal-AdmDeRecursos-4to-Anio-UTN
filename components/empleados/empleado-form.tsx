"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

interface EmpleadoFormProps {
  empleado?: any
  sectores: any[]
  supervisores: any[]
}

export function EmpleadoForm({ empleado, sectores, supervisores }: EmpleadoFormProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  const [formData, setFormData] = useState({
    dni: empleado?.dni || "",
    nombre: empleado?.nombre || "",
    apellido: empleado?.apellido || "",
    fecha_nacimiento: empleado?.fecha_nacimiento || "",
    direccion: empleado?.direccion || "",
    telefono: empleado?.telefono || "",
    email: empleado?.email || "",
    id_sector: empleado?.id_sector?.toString() || "0",
    dni_supervisor: empleado?.dni_supervisor || "0",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    console.log("[v0] Guardando empleado:", formData)

    try {
      const dataToSave = {
        dni: formData.dni,
        nombre: formData.nombre,
        apellido: formData.apellido,
        fecha_nacimiento: formData.fecha_nacimiento,
        direccion: formData.direccion || null,
        telefono: formData.telefono || null,
        email: formData.email,
        id_sector: formData.id_sector ? Number.parseInt(formData.id_sector) : null,
        dni_supervisor: formData.dni_supervisor || null,
        activo: true,
      }

      console.log("[v0] Datos a guardar:", dataToSave)

      if (empleado) {
        const { error } = await supabase.from("empleados").update(dataToSave).eq("dni", empleado.dni)
        if (error) {
          console.error("[v0] Error al actualizar:", error)
          throw error
        }
        toast({ title: "Empleado actualizado correctamente" })
      } else {
        const { error } = await supabase.from("empleados").insert([dataToSave])
        if (error) {
          console.error("[v0] Error al crear:", error)
          throw error
        }
        toast({ title: "Empleado creado correctamente" })
      }

      router.push("/dashboard/empleados")
      router.refresh()
    } catch (error: any) {
      console.error("[v0] Error en submit:", error)
      toast({
        title: "Error",
        description: error.message || "Error al guardar el empleado",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Información del Empleado</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="dni">DNI *</Label>
              <Input
                id="dni"
                value={formData.dni}
                onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
                disabled={!!empleado}
                required
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

            <div className="space-y-2 md:col-span-2">
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
                  <SelectItem value="0">Sin sector</SelectItem>
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
                  <SelectItem value="0">Sin supervisor</SelectItem>
                  {supervisores.map((sup) => (
                    <SelectItem key={sup.dni} value={sup.dni}>
                      {sup.nombre} {sup.apellido}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={loading}>
              {loading ? "Guardando..." : empleado ? "Actualizar" : "Crear"}
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
