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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

interface SectorFormProps {
  sector?: any
  supervisores: any[]
}

export function SectorForm({ sector, supervisores }: SectorFormProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  
  const supabase = createClient()

  const [formData, setFormData] = useState({
    nombre_sector: sector?.nombre_sector || "",
    descripcion: sector?.descripcion || "",
    dni_supervisor: sector?.dni_supervisor || "none",
  })

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
        toast.success("Sector actualizado correctamente")
      } else {
        const { error } = await supabase.from("sectores").insert([dataToSave])
        if (error) throw error
        toast.success("Sector creado correctamente")
      }

      router.push("/dashboard/sectores")
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
        <CardTitle>Información del Sector</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
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

          <div className="flex gap-4">
            <Button type="submit" disabled={loading}>
              {loading ? "Guardando..." : sector ? "Actualizar" : "Crear"}
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
