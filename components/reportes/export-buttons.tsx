"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import * as XLSX from "xlsx"

interface ExportButtonsProps {
  tipo: "empleados" | "sectores" | "capacitaciones"
}

export function ExportButtons({ tipo }: ExportButtonsProps) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const supabase = createClient()

  const exportToExcel = async () => {
    setLoading(true)
    try {
      let data: any[] = []
      let filename = ""

      if (tipo === "empleados") {
        const { data: empleados } = await supabase
          .from("empleados")
          .select(`
            dni,
            nombre,
            apellido,
            fecha_nacimiento,
            direccion,
            telefono,
            email,
            activo,
            sector:sectores(nombre_sector),
            supervisor:empleados!empleados_dni_supervisor_fkey(nombre, apellido)
          `)
          .order("apellido")

        data =
          empleados?.map((e) => ({
            DNI: e.dni,
            Nombre: e.nombre,
            Apellido: e.apellido,
            "Fecha Nacimiento": e.fecha_nacimiento,
            Dirección: e.direccion,
            Teléfono: e.telefono,
            Email: e.email,
            Estado: e.activo ? "Activo" : "Inactivo",
            Sector: e.sector?.nombre_sector || "",
            Supervisor: e.supervisor ? `${e.supervisor.nombre} ${e.supervisor.apellido}` : "",
          })) || []
        filename = "empleados.xlsx"
      } else if (tipo === "sectores") {
        const { data: sectores } = await supabase
          .from("sectores")
          .select(`
            id_sector,
            nombre_sector,
            descripcion,
            supervisor:empleados(nombre, apellido)
          `)
          .order("nombre_sector")

        data =
          sectores?.map((s) => ({
            ID: s.id_sector,
            Nombre: s.nombre_sector,
            Descripción: s.descripcion || "",
            Supervisor: s.supervisor ? `${s.supervisor.nombre} ${s.supervisor.apellido}` : "",
          })) || []
        filename = "sectores.xlsx"
      } else if (tipo === "capacitaciones") {
        const { data: capacitaciones } = await supabase
          .from("capacitaciones")
          .select("*")
          .order("fecha_inicio", { ascending: false })

        data =
          capacitaciones?.map((c) => ({
            ID: c.id_capacitacion,
            Nombre: c.nombre_capacitacion,
            Institución: c.institucion || "",
            "Fecha Inicio": c.fecha_inicio || "",
            "Fecha Fin": c.fecha_fin || "",
            Descripción: c.descripcion || "",
          })) || []
        filename = "capacitaciones.xlsx"
      }

      const worksheet = XLSX.utils.json_to_sheet(data)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, tipo)

      XLSX.writeFile(workbook, filename)

      toast({
        title: "Exportación exitosa",
        description: `Se ha exportado ${data.length} registros`,
      })
    } catch (error: any) {
      toast({
        title: "Error al exportar",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button onClick={exportToExcel} disabled={loading} className="w-full">
      <Download className="mr-2 h-4 w-4" />
      {loading ? "Exportando..." : "Exportar a Excel"}
    </Button>
  )
}
