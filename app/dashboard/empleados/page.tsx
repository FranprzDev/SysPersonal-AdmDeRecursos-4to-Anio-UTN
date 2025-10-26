import { createServerSupabaseClient } from "@/lib/supabase/server"
import { EmpleadosTable } from "@/components/empleados/empleados-table"

export default async function EmpleadosPage() {
  const supabase = await createServerSupabaseClient()

  const { data: empleados } = await supabase
    .from("empleados")
    .select(`
      *,
      sector:sectores(nombre_sector),
      supervisor:empleados!empleados_dni_supervisor_fkey(nombre, apellido)
    `)
    .order("apellido", { ascending: true })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Empleados</h1>
          <p className="text-gray-500">Gestión de empleados del sistema</p>
        </div>
      </div>

      <EmpleadosTable empleados={empleados || []} />
    </div>
  )
}
