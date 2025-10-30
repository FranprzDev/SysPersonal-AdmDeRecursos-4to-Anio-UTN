import { createServerSupabaseClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Building2, GraduationCap, Clock } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient()

  const { count: totalEmpleados } = await supabase
    .from("empleados")
    .select("*", { count: "exact", head: true })
    .eq("activo", true)

  const { count: totalSectores } = await supabase.from("sectores").select("*", { count: "exact", head: true })

  const { count: totalCapacitaciones } = await supabase
    .from("capacitaciones")
    .select("*", { count: "exact", head: true })

  const { count: asistenciasHoy } = await supabase
    .from("asistencias")
    .select("*", { count: "exact", head: true })
    .eq("fecha", new Date().toISOString().split("T")[0])

  const stats = [
    {
      title: "Empleados Activos",
      value: totalEmpleados || 0,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      href: "/dashboard/empleados",
    },
    {
      title: "Sectores",
      value: totalSectores || 0,
      icon: Building2,
      color: "text-green-600",
      bgColor: "bg-green-100",
      href: "/dashboard/sectores",
    },
    {
      title: "Capacitaciones",
      value: totalCapacitaciones || 0,
      icon: GraduationCap,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      href: "/dashboard/capacitaciones",
    },
    {
      title: "Asistencias Hoy",
      value: asistenciasHoy || 0,
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      href: "/dashboard/asistencia",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Resumen general del sistema</p>
      </div>

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

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Accesos Rápidos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/dashboard/empleados">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                Registrar Nuevo Empleado
              </Button>
            </Link>
            <Link href="/dashboard/asistencia">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                Marcar Asistencia
              </Button>
            </Link>
            <Link href="/dashboard/capacitaciones">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                Crear Capacitación
              </Button>
            </Link>
            <Link href="/dashboard/reportes">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                Exportar Reportes
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Análisis y Reportes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/dashboard/desempeno">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                Ver Dashboard de Desempeño
              </Button>
            </Link>
            <Link href="/dashboard/historial">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                Historial de Modificaciones
              </Button>
            </Link>
            <Link href="/dashboard/fichas-medicas">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                Fichas Médicas
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
