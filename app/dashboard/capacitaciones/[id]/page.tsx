import { CapacitacionForm } from "@/components/capacitaciones/capacitacion-form"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"

export default async function EditarCapacitacionPage({ params }: { params: { id: string } }) {
  const supabase = await createServerSupabaseClient()

  const { data: capacitacion } = await supabase
    .from("capacitaciones")
    .select("*")
    .eq("id_capacitacion", params.id)
    .single()

  if (!capacitacion) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Editar Capacitación</h1>
        <p className="text-gray-500">Modificar información de la capacitación</p>
      </div>

      <CapacitacionForm capacitacion={capacitacion} />
    </div>
  )
}
