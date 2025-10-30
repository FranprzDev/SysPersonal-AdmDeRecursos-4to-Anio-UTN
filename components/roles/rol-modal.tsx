"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
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

type RolFormData = {
  nombre_rol: string
  descripcion: string
}

export function RolModal({ open, onOpenChange, rol, onSuccess }: RolModalProps) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RolFormData>({
    defaultValues: {
      nombre_rol: "",
      descripcion: "",
    },
  })

  useEffect(() => {
    if (rol) {
      reset({
        nombre_rol: rol.nombre_rol || "",
        descripcion: rol.descripcion || "",
      })
    } else {
      reset({
        nombre_rol: "",
        descripcion: "",
      })
    }
  }, [rol, open, reset])

  const onSubmit = async (data: RolFormData) => {
    setLoading(true)

    try {
      if (rol) {
        const { error } = await supabase.from("roles").update(data).eq("id_rol", rol.id_rol)
        if (error) throw error
        toast({ title: "Rol actualizado correctamente" })
      } else {
        const { error } = await supabase.from("roles").insert([data])
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nombre_rol">Nombre del Rol *</Label>
            <Input id="nombre_rol" {...register("nombre_rol", { required: "El nombre del rol es obligatorio" })} />
            {errors.nombre_rol && <p className="text-sm text-red-500">{errors.nombre_rol.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea id="descripcion" {...register("descripcion")} rows={4} />
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
