import { createServerSupabaseClient } from "@/lib/supabase/server"
import { RegistroAsistencia } from "@/components/asistencia/registro-asistencia"
import { AsistenciaTable } from "@/components/asistencia/asistencia-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function AsistenciaPage() {
  const supabase = await createServerSupabaseClient()

  const hoy = new Date().toISOString().split("T")[0]

  const { data: empleados } = await supabase
    .from("empleados")
    .select("dni, nombre, apellido")
    .eq("activo", true)
    .order("apellido")

  const { data: asistenciasHoy } = await supabase
    .from("asistencias")
    .select(`
      *,
      empleado:empleados(nombre, apellido, dni)
    `)
    .eq("fecha", hoy)

  const asistenciasMap = new Map(
    (asistenciasHoy || []).map((asistencia) => [asistencia.dni_empleado, asistencia])
  )

  const empleadosConAsistencia = (empleados || []).map((empleado) => {
    const asistencia = asistenciasMap.get(empleado.dni)
    return {
      ...empleado,
      asistencia: asistencia || null,
    }
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Registro de Asistencia</h1>
        <p className="text-gray-500">Control de ingreso y salida del personal</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Marcar Asistencia</CardTitle>
        </CardHeader>
        <CardContent>
          <RegistroAsistencia empleados={empleados || []} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Asistencias de Hoy</CardTitle>
        </CardHeader>
        <CardContent>
          <AsistenciaTable empleadosConAsistencia={empleadosConAsistencia} />
        </CardContent>
      </Card>
    </div>
  )
}
