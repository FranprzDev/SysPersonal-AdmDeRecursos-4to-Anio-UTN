"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { useState } from "react"

interface EmpleadoModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  empleado?: any
  onSuccess: () => void
}

type EmpleadoFormData = {
  dni: string
  nombre: string
  apellido: string
  fecha_nacimiento: string
  direccion: string
  telefono: string
  email: string
  id_sector: string
  dni_supervisor: string
  activo: string
}

export function EmpleadoModal({ open, onOpenChange, empleado, onSuccess }: EmpleadoModalProps) {
  const [loading, setLoading] = useState(false)
  const [sectores, setSectores] = useState<any[]>([])
  const [supervisores, setSupervisores] = useState<any[]>([])
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EmpleadoFormData>({
    defaultValues: {
      dni: "",
      nombre: "",
      apellido: "",
      fecha_nacimiento: "",
      direccion: "",
      telefono: "",
      email: "",
      id_sector: "",
      dni_supervisor: "",
      activo: "true",
    },
  })

  const id_sector = watch("id_sector")
  const dni_supervisor = watch("dni_supervisor")
  const activo = watch("activo")

  useEffect(() => {
    if (empleado) {
      reset({
        dni: empleado.dni || "",
        nombre: empleado.nombre || "",
        apellido: empleado.apellido || "",
        fecha_nacimiento: empleado.fecha_nacimiento || "",
        direccion: empleado.direccion || "",
        telefono: empleado.telefono || "",
        email: empleado.email || "",
        id_sector: empleado.id_sector?.toString() || "",
        dni_supervisor: empleado.dni_supervisor || "",
        activo: empleado.activo ? "true" : "false",
      })
    } else {
      reset({
        dni: "",
        nombre: "",
        apellido: "",
        fecha_nacimiento: "",
        direccion: "",
        telefono: "",
        email: "",
        id_sector: "",
        dni_supervisor: "",
        activo: "true",
      })
    }
  }, [empleado, open, reset])

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

  const onSubmit = async (data: EmpleadoFormData) => {
    setLoading(true)

    try {
      const dataToSave = {
        ...data,
        id_sector: data.id_sector ? Number.parseInt(data.id_sector) : null,
        dni_supervisor: data.dni_supervisor || null,
        activo: data.activo === "true",
      }

      if (empleado) {
        const { error } = await supabase.from("empleados").update(dataToSave).eq("dni", empleado.dni)
        if (error) throw error
        toast.success("Empleado actualizado correctamente")
      } else {
        const { error } = await supabase.from("empleados").insert([dataToSave])
        if (error) throw error
        toast.success("Empleado creado correctamente")
      }

      onSuccess()
      onOpenChange(false)
    } catch (error: any) {
      toast.error(error.message || "Error al guardar el empleado")
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dni">DNI *</Label>
              <Input id="dni" {...register("dni", { required: "El DNI es obligatorio" })} disabled={!!empleado} />
              {errors.dni && <p className="text-sm text-red-500">{errors.dni.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                {...register("email", {
                  required: "El email es obligatorio",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Email inválido",
                  },
                })}
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre *</Label>
              <Input
                id="nombre"
                {...register("nombre", {
                  required: "El nombre es obligatorio",
                  pattern: {
                    value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/,
                    message: "El nombre solo puede contener letras",
                  },
                })}
                onKeyPress={(e) => {
                  if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]$/.test(e.key)) {
                    e.preventDefault()
                  }
                }}
              />
              {errors.nombre && <p className="text-sm text-red-500">{errors.nombre.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="apellido">Apellido *</Label>
              <Input
                id="apellido"
                {...register("apellido", {
                  required: "El apellido es obligatorio",
                  pattern: {
                    value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/,
                    message: "El apellido solo puede contener letras",
                  },
                })}
                onKeyPress={(e) => {
                  if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]$/.test(e.key)) {
                    e.preventDefault()
                  }
                }}
              />
              {errors.apellido && <p className="text-sm text-red-500">{errors.apellido.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="fecha_nacimiento">Fecha de Nacimiento *</Label>
              <Input
                id="fecha_nacimiento"
                type="date"
                {...register("fecha_nacimiento", { required: "La fecha de nacimiento es obligatoria" })}
              />
              {errors.fecha_nacimiento && <p className="text-sm text-red-500">{errors.fecha_nacimiento.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input
                id="telefono"
                {...register("telefono", {
                  pattern: {
                    value: /^[0-9]*$/,
                    message: "El teléfono solo puede contener números",
                  },
                })}
                onKeyPress={(e) => {
                  if (!/^[0-9]$/.test(e.key)) {
                    e.preventDefault()
                  }
                }}
              />
              {errors.telefono && <p className="text-sm text-red-500">{errors.telefono.message}</p>}
            </div>
            <div className="col-span-2 space-y-2">
              <Label htmlFor="direccion">Dirección</Label>
              <Input id="direccion" {...register("direccion")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="id_sector">Sector</Label>
              <Select value={id_sector} onValueChange={(value) => setValue("id_sector", value)}>
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
              <Select value={dni_supervisor} onValueChange={(value) => setValue("dni_supervisor", value)}>
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
            <div className="space-y-2">
              <Label htmlFor="activo">Estado</Label>
              <Select value={activo} onValueChange={(value) => setValue("activo", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Activo</SelectItem>
                  <SelectItem value="false">Inactivo</SelectItem>
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
