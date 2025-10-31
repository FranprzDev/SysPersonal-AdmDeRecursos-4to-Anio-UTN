"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface SectorModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  sector?: any
  onSuccess: () => void
}

type SectorFormData = {
  nombre_sector: string
  descripcion: string
  dni_supervisor: string
}

export function SectorModal({ open, onOpenChange, sector, onSuccess }: SectorModalProps) {
  const [loading, setLoading] = useState(false)
  const [supervisores, setSupervisores] = useState<any[]>([])
  
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SectorFormData>({
    defaultValues: {
      nombre_sector: "",
      descripcion: "",
      dni_supervisor: "none",
    },
  })

  const dni_supervisor = watch("dni_supervisor")

  useEffect(() => {
    if (sector) {
      reset({
        nombre_sector: sector.nombre_sector || "",
        descripcion: sector.descripcion || "",
        dni_supervisor: sector.dni_supervisor || "none",
      })
    } else {
      reset({
        nombre_sector: "",
        descripcion: "",
        dni_supervisor: "none",
      })
    }
  }, [sector, open, reset])

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

  const onSubmit = async (data: SectorFormData) => {
    setLoading(true)

    try {
      const dataToSave = {
        ...data,
        dni_supervisor: data.dni_supervisor === "none" ? null : data.dni_supervisor,
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nombre_sector">Nombre del Sector *</Label>
            <Input
              id="nombre_sector"
              {...register("nombre_sector", { required: "El nombre del sector es obligatorio" })}
            />
            {errors.nombre_sector && <p className="text-sm text-red-500">{errors.nombre_sector.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea id="descripcion" {...register("descripcion")} rows={4} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dni_supervisor">Supervisor del Sector</Label>
            <Select value={dni_supervisor} onValueChange={(value) => setValue("dni_supervisor", value)}>
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
