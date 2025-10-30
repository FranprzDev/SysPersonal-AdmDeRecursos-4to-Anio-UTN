import { createServerSupabaseClient } from "@/lib/supabase/server"
import { EmpleadosTable } from "@/components/empleados/empleados-table"

export default async function EmpleadosPage() {
  const supabase = await createServerSupabaseClient()

  const { data: empleados } = await supabase
    .from("empleados")
    .select("*")
    .eq("activo", true)
    .order("apellido", { ascending: true })

  const { data: sectores } = await supabase.from("sectores").select("id_sector, nombre_sector")

  const { data: supervisores } = await supabase.from("empleados").select("dni, nombre, apellido")

  const empleadosConRelaciones = empleados?.map((emp) => ({
    ...emp,
    sector: sectores?.find((s) => s.id_sector === emp.id_sector),
    supervisor: supervisores?.find((s) => s.dni === emp.dni_supervisor),
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Empleados</h1>
          <p className="text-gray-500">Gestión de empleados del sistema</p>
        </div>
      </div>

      <EmpleadosTable empleados={empleadosConRelaciones || []} />
    </div>
  )
}
