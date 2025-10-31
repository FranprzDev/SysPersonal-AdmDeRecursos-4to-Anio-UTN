import { createServerSupabaseClient } from "@/lib/supabase/server"
import { RegistroAsistencia } from "@/components/asistencia/registro-asistencia"
import { AsistenciaTable } from "@/components/asistencia/asistencia-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getSession } from "@/lib/auth"
import { getPermisosPorRol } from "@/lib/permissions"

export default async function AsistenciaPage() {
  const supabase = await createServerSupabaseClient()
  const user = await getSession()

  if (!user) {
    return null
  }

  const permisos = getPermisosPorRol(user.rol_sistema)
  const esEmpleado = user.rol_sistema === "empleado"
  const hoy = new Date().toISOString().split("T")[0]

  let empleados: any[] = []
  let asistenciasHoy: any[] = []
  let empleadosConAsistencia: any[] = []

  if (esEmpleado && user.dni_empleado) {
    const { data: empleado } = await supabase
      .from("empleados")
      .select("dni, nombre, apellido")
      .eq("dni", user.dni_empleado)
      .eq("activo", true)
      .single()

    if (empleado) {
      empleados = [empleado]
    }

    const { data: asistenciaHoy } = await supabase
      .from("asistencias")
      .select(`
        *,
        empleado:empleados(nombre, apellido, dni)
      `)
      .eq("fecha", hoy)
      .eq("dni_empleado", user.dni_empleado)
      .maybeSingle()

    if (asistenciaHoy && empleado) {
      empleadosConAsistencia = [{
        ...empleado,
        asistencia: asistenciaHoy,
      }]
    } else if (empleado) {
      empleadosConAsistencia = [{
        ...empleado,
        asistencia: null,
      }]
    }
  } else {
    const { data: empleadosData } = await supabase
      .from("empleados")
      .select("dni, nombre, apellido")
      .eq("activo", true)
      .order("apellido")

    empleados = empleadosData || []

    const { data: asistenciasHoyData } = await supabase
      .from("asistencias")
      .select(`
        *,
        empleado:empleados(nombre, apellido, dni)
      `)
      .eq("fecha", hoy)

    asistenciasHoy = asistenciasHoyData || []

    const asistenciasMap = new Map(
      asistenciasHoy.map((asistencia) => [asistencia.dni_empleado, asistencia])
    )

    empleadosConAsistencia = empleados.map((empleado) => {
      const asistencia = asistenciasMap.get(empleado.dni)
      return {
        ...empleado,
        asistencia: asistencia || null,
      }
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Registro de Asistencia</h1>
        <p className="text-gray-500">
          {esEmpleado ? "Registra tu ingreso y salida" : "Control de ingreso y salida del personal"}
        </p>
      </div>

      {permisos.asistencia.crear && (
        <Card>
          <CardHeader>
            <CardTitle>Marcar Asistencia</CardTitle>
          </CardHeader>
          <CardContent>
            <RegistroAsistencia 
              empleados={empleados} 
              dniEmpleadoFijo={esEmpleado ? user.dni_empleado || undefined : undefined}
              modoEmpleado={esEmpleado}
            />
          </CardContent>
        </Card>
      )}

      {permisos.asistencia.ver && (
        <Card>
          <CardHeader>
            <CardTitle>{esEmpleado ? "Mi Asistencia de Hoy" : "Asistencias de Hoy"}</CardTitle>
          </CardHeader>
          <CardContent>
            <AsistenciaTable empleadosConAsistencia={empleadosConAsistencia} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
