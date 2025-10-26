import { createServerSupabaseClient } from "@/lib/supabase/server"
import { HistorialTable } from "@/components/historial/historial-table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function HistorialPage() {
  const supabase = await createServerSupabaseClient()

  const { data: historialEmpleados } = await supabase
    .from("historial_empleados")
    .select(`
      *,
      empleado:empleados(nombre, apellido)
    `)
    .order("fecha_modificacion", { ascending: false })
    .limit(100)

  const { data: historialSectores } = await supabase
    .from("historial_sectores")
    .select(`
      *,
      sector:sectores(nombre_sector)
    `)
    .order("fecha_modificacion", { ascending: false })
    .limit(100)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Historial de Modificaciones</h1>
        <p className="text-gray-500">Auditoría de cambios en el sistema</p>
      </div>

      <Tabs defaultValue="empleados">
        <TabsList>
          <TabsTrigger value="empleados">Empleados</TabsTrigger>
          <TabsTrigger value="sectores">Sectores</TabsTrigger>
        </TabsList>
        <TabsContent value="empleados">
          <HistorialTable data={historialEmpleados || []} tipo="empleado" />
        </TabsContent>
        <TabsContent value="sectores">
          <HistorialTable data={historialSectores || []} tipo="sector" />
        </TabsContent>
      </Tabs>
    </div>
  )
}
