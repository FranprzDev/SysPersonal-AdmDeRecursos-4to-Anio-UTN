"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

interface CapacitacionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  capacitacion?: any
  onSuccess: () => void
}

type CapacitacionFormData = {
  nombre_capacitacion: string
  institucion: string
  fecha_inicio: string
  fecha_fin: string
  descripcion: string
}

export function CapacitacionModal({ open, onOpenChange, capacitacion, onSuccess }: CapacitacionModalProps) {
  const [loading, setLoading] = useState(false)
  
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CapacitacionFormData>({
    defaultValues: {
      nombre_capacitacion: "",
      institucion: "",
      fecha_inicio: "",
      fecha_fin: "",
      descripcion: "",
    },
  })

  useEffect(() => {
    if (capacitacion) {
      reset({
        nombre_capacitacion: capacitacion.nombre_capacitacion || "",
        institucion: capacitacion.institucion || "",
        fecha_inicio: capacitacion.fecha_inicio || "",
        fecha_fin: capacitacion.fecha_fin || "",
        descripcion: capacitacion.descripcion || "",
      })
    } else {
      reset({
        nombre_capacitacion: "",
        institucion: "",
        fecha_inicio: "",
        fecha_fin: "",
        descripcion: "",
      })
    }
  }, [capacitacion, open, reset])

  const onSubmit = async (data: CapacitacionFormData) => {
    setLoading(true)

    try {
      if (capacitacion) {
        const { error } = await supabase
          .from("capacitaciones")
          .update(data)
          .eq("id_capacitacion", capacitacion.id_capacitacion)
        if (error) throw error
        toast.success("Capacitación actualizada correctamente")
      } else {
        const { error } = await supabase.from("capacitaciones").insert([data])
        if (error) throw error
        toast.success("Capacitación creada correctamente")
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-2">
              <Label htmlFor="nombre_capacitacion">Nombre de la Capacitación *</Label>
              <Input
                id="nombre_capacitacion"
                {...register("nombre_capacitacion", { required: "El nombre de la capacitación es obligatorio" })}
              />
              {errors.nombre_capacitacion && (
                <p className="text-sm text-red-500">{errors.nombre_capacitacion.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="institucion">Institución</Label>
              <Input id="institucion" {...register("institucion")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fecha_inicio">Fecha de Inicio</Label>
              <Input id="fecha_inicio" type="date" {...register("fecha_inicio")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fecha_fin">Fecha de Fin</Label>
              <Input id="fecha_fin" type="date" {...register("fecha_fin")} />
            </div>

            <div className="col-span-2 space-y-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea id="descripcion" {...register("descripcion")} rows={4} />
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
