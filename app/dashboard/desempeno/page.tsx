import { createServerSupabaseClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EmpleadosPorSectorChart } from "@/components/desempeno/empleados-por-sector-chart"
import { AsistenciaMensualChart } from "@/components/desempeno/asistencia-mensual-chart"
import { CapacitacionesChart } from "@/components/desempeno/capacitaciones-chart"
import { Users, GraduationCap, Clock, TrendingUp } from "lucide-react"

export default async function DesempenoPage() {
  const supabase = await createServerSupabaseClient()

  const { data: empleados } = await supabase
    .from("empleados")
    .select("id_sector")
    .eq("activo", true)

  const sectoresCount = empleados?.reduce(
    (acc, emp) => {
      const idSector = emp.id_sector ?? "sin_sector"
      acc[idSector] = (acc[idSector] || 0) + 1
      return acc
    },
    {} as Record<string | number, number>,
  )

  const { data: sectores } = await supabase
    .from("sectores")
    .select("id_sector, nombre_sector")

  const sectoresMap = new Map(
    sectores?.map((s) => [s.id_sector, s.nombre_sector]) || [],
  )

  const chartDataSectores = Object.entries(sectoresCount || {})
    .map(([idSector, count]) => {
      const sectorId = idSector === "sin_sector" ? null : Number(idSector)
      const nombreSector = sectorId ? sectoresMap.get(sectorId) || "Sin sector" : "Sin sector"
      return {
        sector: nombreSector,
        empleados: count,
      }
    })
    .filter((item) => item.empleados > 0)

  const { count: totalEmpleados } = await supabase
    .from("empleados")
    .select("*", { count: "exact", head: true })
    .eq("activo", true)

  const { count: totalCapacitaciones } = await supabase
    .from("empleado_capacitacion")
    .select("*", { count: "exact", head: true })

  const hoy = new Date().toISOString().split("T")[0]
  const { count: asistenciasHoy } = await supabase
    .from("asistencias")
    .select("*", { count: "exact", head: true })
    .eq("fecha", hoy)

  const asistenciaPromedio = totalEmpleados ? Math.round(((asistenciasHoy || 0) / totalEmpleados) * 100) : 0

  const stats = [
    {
      title: "Total Empleados",
      value: totalEmpleados || 0,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Capacitaciones Realizadas",
      value: totalCapacitaciones || 0,
      icon: GraduationCap,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Asistencia Hoy",
      value: asistenciasHoy || 0,
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      title: "Asistencia Promedio",
      value: `${asistenciaPromedio}%`,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard de Desempeño</h1>
        <p className="text-gray-500">Métricas y análisis del personal</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
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
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Empleados por Sector</CardTitle>
          </CardHeader>
          <CardContent>
            <EmpleadosPorSectorChart data={chartDataSectores} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Asistencia Mensual</CardTitle>
          </CardHeader>
          <CardContent>
            <AsistenciaMensualChart />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Capacitaciones por Mes</CardTitle>
        </CardHeader>
        <CardContent>
          <CapacitacionesChart />
        </CardContent>
      </Card>
    </div>
  )
}
