import { AsignarCapacitacion } from "@/components/capacitaciones/asignar-capacitacion"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"

export default async function AsignarCapacitacionPage({ params }: { params: { id: string } }) {
  const supabase = await createServerSupabaseClient()

  const { data: capacitacion } = await supabase
    .from("capacitaciones")
    .select("*")
    .eq("id_capacitacion", params.id)
    .single()

  if (!capacitacion) {
    notFound()
  }

  const { data: empleados } = await supabase
    .from("empleados")
    .select("dni, nombre, apellido")
    .eq("activo", true)
    .order("apellido")

  const { data: asignados } = await supabase
    .from("empleado_capacitacion")
    .select("dni_empleado")
    .eq("id_capacitacion", params.id)

  const empleadosAsignados = asignados?.map((a) => a.dni_empleado) || []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Asignar Empleados</h1>
        <p className="text-gray-500">{capacitacion.nombre_capacitacion}</p>
      </div>

      <AsignarCapacitacion
        capacitacionId={Number.parseInt(params.id)}
        empleados={empleados || []}
        empleadosAsignados={empleadosAsignados}
      />
    </div>
  )
}
