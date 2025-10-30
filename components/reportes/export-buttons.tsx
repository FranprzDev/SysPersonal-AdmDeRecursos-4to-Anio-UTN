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
      console.log("[EXPORT] Iniciando exportación, tipo:", tipo)
      let data: any[] = []
      let filename = ""

      if (tipo === "empleados") {
        console.log("[EXPORT] Tipo: empleados - Iniciando consultas")
        
        console.log("[EXPORT] Paso 1: Consultando empleados...")
        const { data: empleados, error: empleadosError } = await supabase
          .from("empleados")
          .select("*")
          .eq("activo", true)
          .order("apellido")
        
        console.log("[EXPORT] Empleados consultados:", empleados?.length || 0, "registros")
        console.log("[EXPORT] Error empleados:", empleadosError)
        if (empleadosError) {
          console.error("[EXPORT] ERROR en consulta de empleados:", empleadosError)
          throw empleadosError
        }

        console.log("[EXPORT] Paso 2: Consultando sectores...")
        const { data: sectores, error: sectoresError } = await supabase
          .from("sectores")
          .select("id_sector, nombre_sector")
        
        console.log("[EXPORT] Sectores consultados:", sectores?.length || 0, "registros")
        console.log("[EXPORT] Error sectores:", sectoresError)
        if (sectoresError) {
          console.error("[EXPORT] ERROR en consulta de sectores:", sectoresError)
          throw sectoresError
        }

        console.log("[EXPORT] Paso 3: Consultando supervisores...")
        const { data: supervisores, error: supervisoresError } = await supabase
          .from("empleados")
          .select("dni, nombre, apellido")
          .eq("activo", true)
        
        console.log("[EXPORT] Supervisores consultados:", supervisores?.length || 0, "registros")
        console.log("[EXPORT] Error supervisores:", supervisoresError)
        if (supervisoresError) {
          console.error("[EXPORT] ERROR en consulta de supervisores:", supervisoresError)
          throw supervisoresError
        }

        console.log("[EXPORT] Paso 4: Procesando datos...")
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
        console.log("[EXPORT] Datos procesados:", data.length, "registros")
        filename = "empleados.xlsx"
      } else if (tipo === "sectores") {
        console.log("[EXPORT] Tipo: sectores - Iniciando consulta")
        console.log("[EXPORT] Consultando sectores con relación embebida...")
        
        const { data: sectores, error } = await supabase
          .from("sectores")
          .select(`
            id_sector,
            nombre_sector,
            descripcion,
            supervisor:empleados!sectores_dni_supervisor_fkey(nombre, apellido)
          `)
          .order("nombre_sector")

        console.log("[EXPORT] Sectores consultados:", sectores?.length || 0, "registros")
        console.log("[EXPORT] Error sectores:", error)
        if (error) {
          console.error("[EXPORT] ERROR en consulta de sectores:", error)
          throw error
        }

        console.log("[EXPORT] Procesando datos de sectores...")
        data =
          sectores?.map((s) => ({
            ID: s.id_sector,
            Nombre: s.nombre_sector,
            Descripción: s.descripcion || "",
            Supervisor: s.supervisor ? `${s.supervisor[0]?.nombre} ${s.supervisor[0]?.apellido}` : "",
          })) || []
        console.log("[EXPORT] Datos procesados:", data.length, "registros")
        filename = "sectores.xlsx"
      } else if (tipo === "capacitaciones") {
        console.log("[EXPORT] Tipo: capacitaciones - Iniciando consulta")
        
        const { data: capacitaciones, error } = await supabase
          .from("capacitaciones")
          .select("*")
          .order("fecha_inicio", { ascending: false })

        console.log("[EXPORT] Capacitaciones consultadas:", capacitaciones?.length || 0, "registros")
        console.log("[EXPORT] Error capacitaciones:", error)
        if (error) {
          console.error("[EXPORT] ERROR en consulta de capacitaciones:", error)
          throw error
        }

        console.log("[EXPORT] Procesando datos de capacitaciones...")
        data =
          capacitaciones?.map((c) => ({
            ID: c.id_capacitacion,
            Nombre: c.nombre_capacitacion,
            Institución: c.institucion || "",
            "Fecha Inicio": c.fecha_inicio || "",
            "Fecha Fin": c.fecha_fin || "",
            Descripción: c.descripcion || "",
          })) || []
        console.log("[EXPORT] Datos procesados:", data.length, "registros")
        filename = "capacitaciones.xlsx"
      }

      console.log("[EXPORT] Generando archivo Excel...")
      console.log("[EXPORT] Total de registros a exportar:", data.length)
      
      const worksheet = XLSX.utils.json_to_sheet(data)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, tipo)

      console.log("[EXPORT] Escribiendo archivo:", filename)
      XLSX.writeFile(workbook, filename)

      console.log("[EXPORT] Exportación completada exitosamente")
      toast({
        title: "Exportación exitosa",
        description: `Se ha exportado ${data.length} registros`,
      })
    } catch (error: any) {
      console.error("[EXPORT] ERROR GENERAL:", error)
      console.error("[EXPORT] Error message:", error.message)
      console.error("[EXPORT] Error details:", error)
      console.error("[EXPORT] Error stack:", error.stack)
      toast({
        title: "Error al exportar",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      console.log("[EXPORT] Finalizando proceso de exportación")
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
