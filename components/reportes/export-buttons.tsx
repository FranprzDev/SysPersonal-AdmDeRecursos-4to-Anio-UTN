"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import * as XLSX from "xlsx"

interface ExportButtonsProps {
  tipo: "empleados" | "sectores" | "capacitaciones"
}

export function ExportButtons({ tipo }: ExportButtonsProps) {
  const [loading, setLoading] = useState(false)
  
  const supabase = createClient()

  const exportToExcel = async () => {
    setLoading(true)
    try {
      let data: any[] = []
      let filename = ""

      if (tipo === "empleados") {

        const { data: empleados, error: empleadosError } = await supabase
          .from("empleados")
          .select("*")
          .eq("activo", true)
          .order("apellido")

        if (empleadosError) {
          throw empleadosError
        }

        const { data: sectores, error: sectoresError } = await supabase
          .from("sectores")
          .select("id_sector, nombre_sector")

        if (sectoresError) {
          throw sectoresError
        }

        const { data: supervisores, error: supervisoresError } = await supabase
          .from("empleados")
          .select("dni, nombre, apellido")
          .eq("activo", true)

        if (supervisoresError) {
          throw supervisoresError
        }

        data =
          empleados?.map((e) => {
            const sector = sectores?.find((s) => s.id_sector === e.id_sector)
            const supervisor = supervisores?.find((s) => s.dni === e.dni_supervisor)
            return {
              DNI: e.dni,
              Nombre: e.nombre,
              Apellido: e.apellido,
              "Fecha Nacimiento": e.fecha_nacimiento || "",
              Dirección: e.direccion || "",
              Teléfono: e.telefono || "",
              Email: e.email || "",
              Estado: e.activo ? "Activo" : "Inactivo",
              Sector: sector?.nombre_sector || "",
              Supervisor: supervisor ? `${supervisor.nombre} ${supervisor.apellido}` : "",
            }
          }) || []
        filename = "empleados.xlsx"
      } else if (tipo === "sectores") {

        const { data: sectores, error } = await supabase
          .from("sectores")
          .select(`
            id_sector,
            nombre_sector,
            descripcion,
            supervisor:empleados!sectores_dni_supervisor_fkey(nombre, apellido)
          `)
          .order("nombre_sector")

        if (error) {
          throw error
        }

        data =
          sectores?.map((s) => ({
            ID: s.id_sector,
            Nombre: s.nombre_sector,
            Descripción: s.descripcion || "",
            Supervisor: s.supervisor ? `${s.supervisor[0]?.nombre} ${s.supervisor[0]?.apellido}` : "",
          })) || []
        filename = "sectores.xlsx"
      } else if (tipo === "capacitaciones") {

        const { data: capacitaciones, error } = await supabase
          .from("capacitaciones")
          .select("*")
          .order("fecha_inicio", { ascending: false })

        if (error) {
          throw error
        }

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
      toast.success(`Exportación exitosa: Se ha exportado ${data.length} registros`)
    } catch (error: any) {
      toast.error(`Error al exportar: ${error.message}`)
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
