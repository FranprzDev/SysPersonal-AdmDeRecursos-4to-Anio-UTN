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

interface FichaMedicaFormProps {
  ficha?: any
  empleados: any[]
}

export function FichaMedicaForm({ ficha, empleados }: FichaMedicaFormProps) {
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const router = useRouter()
  
  const supabase = createClient()

  const [formData, setFormData] = useState({
    dni_empleado: ficha?.dni_empleado || "",
    grupo_sanguineo: ficha?.grupo_sanguineo || "",
    alergias: ficha?.alergias || "",
    enfermedades_preexistentes: ficha?.enfermedades_preexistentes || "",
    aptitud_medica: ficha?.aptitud_medica || "Apto",
    fecha_control: ficha?.fecha_control || "",
    observaciones: ficha?.observaciones || "",
    documento_adjunto: ficha?.documento_adjunto || "",
  })

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const fileExt = file.name.split(".").pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `fichas-medicas/${fileName}`

      const { error: uploadError } = await supabase.storage.from("documentos").upload(filePath, file)

      if (uploadError) throw uploadError

      const {
        data: { publicUrl },
      } = supabase.storage.from("documentos").getPublicUrl(filePath)

      setFormData({ ...formData, documento_adjunto: publicUrl })
      toast.success("Archivo subido correctamente")
    } catch (error: any) {
      toast({
        title: "Error al subir archivo",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (ficha) {
        const { error } = await supabase.from("fichas_medicas").update(formData).eq("id_ficha", ficha.id_ficha)
        if (error) throw error
        toast.success("Ficha médica actualizada correctamente")
      } else {
        const { error } = await supabase.from("fichas_medicas").insert([formData])
        if (error) throw error
        toast.success("Ficha médica creada correctamente")
      }

      router.push("/dashboard/fichas-medicas")
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
        <CardTitle>Información Médica</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="dni_empleado">Empleado *</Label>
            <Select
              value={formData.dni_empleado}
              onValueChange={(value) => setFormData({ ...formData, dni_empleado: value })}
              disabled={!!ficha}
            >
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

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="grupo_sanguineo">Grupo Sanguíneo</Label>
              <Input
                id="grupo_sanguineo"
                value={formData.grupo_sanguineo}
                onChange={(e) => setFormData({ ...formData, grupo_sanguineo: e.target.value })}
                placeholder="Ej: O+"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="aptitud_medica">Aptitud Médica *</Label>
              <Select
                value={formData.aptitud_medica}
                onValueChange={(value) => setFormData({ ...formData, aptitud_medica: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Apto">Apto</SelectItem>
                  <SelectItem value="No apto">No apto</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fecha_control">Fecha de Control</Label>
              <Input
                id="fecha_control"
                type="date"
                value={formData.fecha_control}
                onChange={(e) => setFormData({ ...formData, fecha_control: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="alergias">Alergias</Label>
            <Textarea
              id="alergias"
              value={formData.alergias}
              onChange={(e) => setFormData({ ...formData, alergias: e.target.value })}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="enfermedades_preexistentes">Enfermedades Preexistentes</Label>
            <Textarea
              id="enfermedades_preexistentes"
              value={formData.enfermedades_preexistentes}
              onChange={(e) => setFormData({ ...formData, enfermedades_preexistentes: e.target.value })}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="observaciones">Observaciones</Label>
            <Textarea
              id="observaciones"
              value={formData.observaciones}
              onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="documento">Documento Adjunto</Label>
            <Input id="documento" type="file" onChange={handleFileUpload} disabled={uploading} />
            {formData.documento_adjunto && (
              <p className="text-sm text-green-600">Archivo adjunto guardado correctamente</p>
            )}
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={loading || uploading}>
              {loading ? "Guardando..." : ficha ? "Actualizar" : "Crear"}
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
