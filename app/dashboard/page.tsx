import { createServerSupabaseClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Building2, GraduationCap, Clock } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getSession } from "@/lib/auth"
import { getPermisosPorRol } from "@/lib/permissions"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient()
  const user = await getSession()

  if (!user) {
    return null
  }

  if (user.rol_sistema === "empleado") {
    redirect("/dashboard/mi-perfil")
  }

  const permisos = getPermisosPorRol(user.rol_sistema)

  const stats = []

  if (permisos.empleados.ver) {
    const { count: totalEmpleados } = await supabase
      .from("empleados")
      .select("*", { count: "exact", head: true })
      .eq("activo", true)
    stats.push({
      title: "Empleados Activos",
      value: totalEmpleados || 0,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      href: "/dashboard/empleados",
    })
  }

  if (permisos.sectores.ver) {
    const { count: totalSectores } = await supabase.from("sectores").select("*", { count: "exact", head: true })
    stats.push({
      title: "Sectores",
      value: totalSectores || 0,
      icon: Building2,
      color: "text-green-600",
      bgColor: "bg-green-100",
      href: "/dashboard/sectores",
    })
  }

  if (permisos.capacitaciones.ver) {
    const { count: totalCapacitaciones } = await supabase
      .from("capacitaciones")
      .select("*", { count: "exact", head: true })
    stats.push({
      title: "Capacitaciones",
      value: totalCapacitaciones || 0,
      icon: GraduationCap,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      href: "/dashboard/capacitaciones",
    })
  }

  if (permisos.asistencia.ver) {
    const { count: asistenciasHoy } = await supabase
      .from("asistencias")
      .select("*", { count: "exact", head: true })
      .eq("fecha", new Date().toISOString().split("T")[0])
    stats.push({
      title: "Asistencias Hoy",
      value: asistenciasHoy || 0,
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      href: "/dashboard/asistencia",
    })
  }

  const accesosRapidos = []
  if (permisos.empleados.crear) {
    accesosRapidos.push({
      href: "/dashboard/empleados",
      label: "Registrar Nuevo Empleado",
    })
  }
  if (permisos.asistencia.crear) {
    accesosRapidos.push({
      href: "/dashboard/asistencia",
      label: "Marcar Asistencia",
    })
  }
  if (permisos.capacitaciones.crear) {
    accesosRapidos.push({
      href: "/dashboard/capacitaciones",
      label: "Crear Capacitación",
    })
  }
  if (permisos.reportes.ver) {
    accesosRapidos.push({
      href: "/dashboard/reportes",
      label: "Exportar Reportes",
    })
  }

  const analisisReportes = []
  if (permisos.desempeno.ver) {
    analisisReportes.push({
      href: "/dashboard/desempeno",
      label: "Ver Dashboard de Desempeño",
    })
  }
  if (permisos.historial.ver) {
    analisisReportes.push({
      href: "/dashboard/historial",
      label: "Historial de Modificaciones",
    })
  }
  if (permisos.fichasMedicas.ver) {
    analisisReportes.push({
      href: "/dashboard/fichas-medicas",
      label: "Fichas Médicas",
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Resumen general del sistema</p>
      </div>

      {stats.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Link key={stat.title} href={stat.href}>
              <Card className="transition-shadow hover:shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                  <div className={`rounded-full p-2 ${stat.bgColor}`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {(accesosRapidos.length > 0 || analisisReportes.length > 0) && (
        <div className="grid gap-6 md:grid-cols-2">
          {accesosRapidos.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Accesos Rápidos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {accesosRapidos.map((acceso) => (
                  <Link key={acceso.href} href={acceso.href}>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      {acceso.label}
                    </Button>
                  </Link>
                ))}
              </CardContent>
            </Card>
          )}

          {analisisReportes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Análisis y Reportes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {analisisReportes.map((reporte) => (
                  <Link key={reporte.href} href={reporte.href}>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      {reporte.label}
                    </Button>
                  </Link>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
