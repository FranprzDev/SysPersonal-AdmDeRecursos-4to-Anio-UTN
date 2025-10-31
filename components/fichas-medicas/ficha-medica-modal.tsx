"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { useForm } from "react-hook-form"
import { createClient } from "@/lib/supabase/client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { FileText, Upload, X, Download } from "lucide-react"
import { cn } from "@/lib/utils"

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
  const [previewFile, setPreviewFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
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
      setPreviewFile(null)
      setIsDragging(false)
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const maxSize = 10 * 1024 * 1024
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/jpg"]

    if (file.size > maxSize) {
      toast.error("El archivo es demasiado grande. Máximo 10MB")
      return
    }

    if (!allowedTypes.includes(file.type)) {
      toast.error("Tipo de archivo no permitido. Solo PDF, JPEG y PNG")
      return
    }

    setPreviewFile(file)
    handleFileUpload(file)
  }

  const handleFileUpload = async (file: File) => {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/storage/upload", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Error al subir el archivo")
      }

      setValue("documento_adjunto", result.url)
      setPreviewFile(null)
      toast.success(`Archivo subido correctamente: ${file.name}`)
    } catch (error: any) {
      console.error("Error completo:", error)
      toast.error(error.message || "Error desconocido al subir el archivo")
      setPreviewFile(null)
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleRemoveFile = () => {
    setPreviewFile(null)
    setValue("documento_adjunto", "")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const getFileNameFromUrl = (url: string): string => {
    try {
      const urlParts = url.split("/")
      return urlParts[urlParts.length - 1] || "documento"
    } catch {
      return "documento"
    }
  }

  const getFileType = (url: string): "pdf" | "image" => {
    if (url.toLowerCase().includes(".pdf")) return "pdf"
    return "image"
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!uploading) {
      setIsDragging(true)
    }
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (uploading) return

    const file = e.dataTransfer.files?.[0]
    if (!file) return

    const maxSize = 10 * 1024 * 1024
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/jpg"]

    if (file.size > maxSize) {
      toast.error("El archivo es demasiado grande. Máximo 10MB")
      return
    }

    if (!allowedTypes.includes(file.type)) {
      toast.error("Tipo de archivo no permitido. Solo PDF, JPEG y PNG")
      return
    }

    setPreviewFile(file)
    handleFileUpload(file)
  }

  const onSubmit = async (data: FichaMedicaFormData) => {
    setLoading(true)

    try {
      if (ficha) {
        const { error } = await supabase.from("fichas_medicas").update(data).eq("id_ficha", ficha.id_ficha)
        if (error) throw error
        toast.success("Ficha médica actualizada correctamente")
      } else {
        const { error } = await supabase.from("fichas_medicas").insert([data])
        if (error) throw error
        toast.success("Ficha médica creada correctamente")
      }

      onClose()
    } catch (error: any) {
      toast.error(error.message || "Error al guardar la ficha médica")
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
            <div className="space-y-3">
              {documento_adjunto && !previewFile ? (
                <div className="flex items-center gap-3 p-4 border rounded-lg bg-muted/50">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{getFileNameFromUrl(documento_adjunto)}</p>
                    <p className="text-xs text-muted-foreground">
                      {getFileType(documento_adjunto) === "pdf" ? "PDF" : "Imagen"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        window.open(documento_adjunto, "_blank")
                      }}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Ver
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleRemoveFile}
                      disabled={uploading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : previewFile ? (
                <div className="flex items-center gap-3 p-4 border rounded-lg bg-muted/50">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{previewFile.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(previewFile.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {uploading ? (
                      <span className="text-sm text-muted-foreground">Subiendo...</span>
                    ) : (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleRemoveFile}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ) : null}

              <div
                className={cn(
                  "relative border-2 border-dashed rounded-lg p-6 transition-colors",
                  uploading
                    ? "border-muted bg-muted/50 cursor-not-allowed"
                    : isDragging
                      ? "border-primary bg-primary/5 cursor-pointer"
                      : "border-muted-foreground/25 hover:border-muted-foreground/50 cursor-pointer bg-muted/20"
                )}
                onClick={() => {
                  if (!uploading) {
                    fileInputRef.current?.click()
                  }
                }}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  id="documento"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileSelect}
                  disabled={uploading}
                  className="hidden"
                />
                <div className="flex flex-col items-center justify-center gap-2 text-center">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <div className="text-sm">
                    <span className="font-medium text-primary">Haz clic para subir</span> o arrastra y suelta
                  </div>
                  <p className="text-xs text-muted-foreground">
                    PDF, JPEG o PNG (máx. 10MB)
                  </p>
                </div>
              </div>
            </div>
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
