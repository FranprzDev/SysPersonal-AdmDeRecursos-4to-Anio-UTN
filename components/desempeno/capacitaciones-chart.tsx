"use client"

import { useEffect, useState } from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { createClient } from "@/lib/supabase/client"

const MESES_A_MOSTRAR = 6

export function CapacitacionesChart() {
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    const supabase = createClient()
    
    const fetchData = async () => {
      const hoy = new Date()
      const mesInicio = new Date(hoy.getFullYear(), hoy.getMonth() - (MESES_A_MOSTRAR - 1), 1)
      const mesFin = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0)
      
      const fechaInicio = `${mesInicio.getFullYear()}-${String(mesInicio.getMonth() + 1).padStart(2, "0")}-01`
      const fechaFin = `${mesFin.getFullYear()}-${String(mesFin.getMonth() + 1).padStart(2, "0")}-${String(mesFin.getDate()).padStart(2, "0")}`

      const { data: capacitaciones } = await supabase
        .from("empleado_capacitacion")
        .select("fecha_realizacion")
        .gte("fecha_realizacion", fechaInicio)
        .lte("fecha_realizacion", fechaFin)

      const mesesMap = new Map<string, number>()
      
      for (let i = MESES_A_MOSTRAR - 1; i >= 0; i--) {
        const fecha = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1)
        const mesKey = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, "0")}`
        mesesMap.set(mesKey, 0)
      }

      if (capacitaciones) {
        capacitaciones.forEach((cap) => {
          if (cap.fecha_realizacion) {
            const fecha = new Date(cap.fecha_realizacion)
            const mesKey = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, "0")}`
            const count = mesesMap.get(mesKey) || 0
            mesesMap.set(mesKey, count + 1)
          }
        })
      }

      const meses: any[] = []
      for (let i = MESES_A_MOSTRAR - 1; i >= 0; i--) {
        const fecha = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1)
        const mesKey = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, "0")}`
        meses.push({
          mes: fecha.toLocaleDateString("es-ES", { month: "short" }),
          capacitaciones: mesesMap.get(mesKey) || 0,
        })
      }

      setData(meses)
    }

    fetchData()
  }, [])

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="mes" />
        <YAxis />
        <Tooltip />
        <Area type="monotone" dataKey="capacitaciones" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
      </AreaChart>
    </ResponsiveContainer>
  )
}
