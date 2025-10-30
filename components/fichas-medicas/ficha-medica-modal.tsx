"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { createClient } from "@/lib/supabase/client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

interface FichaMedicaModalProps {
  isOpen: boolean
  onClose: () => void
  ficha?: any
}

type FichaMedicaFormData = {
  dni_empleado: string
  grupo_sanguineo: string
  alergias: string
  enfermedades_preexistentes: string
  aptitud_medica: string
  fecha_control: string
  observaciones: string
  documento_adjunto: string
}

export function FichaMedicaModal({ isOpen, onClose, ficha }: FichaMedicaModalProps) {
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [empleados, setEmpleados] = useState<any[]>([])
  const { toast } = useToast()
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FichaMedicaFormData>({
    defaultValues: {
      dni_empleado: "",
      grupo_sanguineo: "",
      alergias: "",
      enfermedades_preexistentes: "",
      aptitud_medica: "Apto",
      fecha_control: "",
      observaciones: "",
      documento_adjunto: "",
    },
  })

  const dni_empleado = watch("dni_empleado")
  const aptitud_medica = watch("aptitud_medica")
  const documento_adjunto = watch("documento_adjunto")

  useEffect(() => {
    if (isOpen) {
      loadEmpleados()
      if (ficha) {
        reset({
          dni_empleado: ficha.dni_empleado || "",
          grupo_sanguineo: ficha.grupo_sanguineo || "",
          alergias: ficha.alergias || "",
          enfermedades_preexistentes: ficha.enfermedades_preexistentes || "",
          aptitud_medica: ficha.aptitud_medica || "Apto",
          fecha_control: ficha.fecha_control || "",
          observaciones: ficha.observaciones || "",
          documento_adjunto: ficha.documento_adjunto || "",
        })
      } else {
        reset({
          dni_empleado: "",
          grupo_sanguineo: "",
          alergias: "",
          enfermedades_preexistentes: "",
          aptitud_medica: "Apto",
          fecha_control: "",
          observaciones: "",
          documento_adjunto: "",
        })
      }
    }
  }, [isOpen, ficha, reset])

  const loadEmpleados = async () => {
    const { data } = await supabase
      .from("empleados")
      .select("dni, nombre, apellido")
      .eq("activo", true)
      .order("apellido")

    setEmpleados(data || [])
  }

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

      setValue("documento_adjunto", publicUrl)
      toast({ title: "Archivo subido correctamente" })
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

  const onSubmit = async (data: FichaMedicaFormData) => {
    setLoading(true)

    try {
      if (ficha) {
        const { error } = await supabase.from("fichas_medicas").update(data).eq("id_ficha", ficha.id_ficha)
        if (error) throw error
        toast({ title: "Ficha médica actualizada correctamente" })
      } else {
        const { error } = await supabase.from("fichas_medicas").insert([data])
        if (error) throw error
        toast({ title: "Ficha médica creada correctamente" })
      }

      onClose()
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{ficha ? "Editar" : "Nueva"} Ficha Médica</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="dni_empleado">Empleado *</Label>
            <Select value={dni_empleado} onValueChange={(value) => setValue("dni_empleado", value)} disabled={!!ficha}>
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
            {errors.dni_empleado && <p className="text-sm text-red-500">{errors.dni_empleado.message}</p>}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="grupo_sanguineo">Grupo Sanguíneo</Label>
              <Input id="grupo_sanguineo" {...register("grupo_sanguineo")} placeholder="Ej: O+" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="aptitud_medica">Aptitud Médica *</Label>
              <Select value={aptitud_medica} onValueChange={(value) => setValue("aptitud_medica", value)}>
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
              <Input id="fecha_control" type="date" {...register("fecha_control")} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="alergias">Alergias</Label>
            <Textarea id="alergias" {...register("alergias")} rows={2} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="enfermedades_preexistentes">Enfermedades Preexistentes</Label>
            <Textarea id="enfermedades_preexistentes" {...register("enfermedades_preexistentes")} rows={2} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="observaciones">Observaciones</Label>
            <Textarea id="observaciones" {...register("observaciones")} rows={2} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="documento">Documento Adjunto</Label>
            <Input id="documento" type="file" onChange={handleFileUpload} disabled={uploading} />
            {documento_adjunto && <p className="text-sm text-green-600">Archivo adjunto guardado</p>}
          </div>

          <div className="flex gap-4 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading || uploading}>
              {loading ? "Guardando..." : ficha ? "Actualizar" : "Crear"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
