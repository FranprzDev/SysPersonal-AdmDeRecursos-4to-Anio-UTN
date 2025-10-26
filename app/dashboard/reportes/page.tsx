import { createServerSupabaseClient } from "@/lib/supabase/server"
import { ExportButtons } from "@/components/reportes/export-buttons"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileSpreadsheet } from "lucide-react"

export default async function ReportesPage() {
  const supabase = await createServerSupabaseClient()

  const { count: totalEmpleados } = await supabase
    .from("empleados")
    .select("*", { count: "exact", head: true })
    .eq("activo", true)

  const { count: totalSectores } = await supabase.from("sectores").select("*", { count: "exact", head: true })

  const { count: totalCapacitaciones } = await supabase
    .from("capacitaciones")
    .select("*", { count: "exact", head: true })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reportes y Exportación</h1>
        <p className="text-gray-500">Exportar datos del sistema a Excel</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-green-600" />
              Empleados
            </CardTitle>
            <CardDescription>{totalEmpleados} registros disponibles</CardDescription>
          </CardHeader>
          <CardContent>
            <ExportButtons tipo="empleados" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-blue-600" />
              Sectores
            </CardTitle>
            <CardDescription>{totalSectores} registros disponibles</CardDescription>
          </CardHeader>
          <CardContent>
            <ExportButtons tipo="sectores" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-purple-600" />
              Capacitaciones
            </CardTitle>
            <CardDescription>{totalCapacitaciones} registros disponibles</CardDescription>
          </CardHeader>
          <CardContent>
            <ExportButtons tipo="capacitaciones" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
