"use client"

import { useEffect, useState } from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { createClient } from "@/lib/supabase/client"

export function CapacitacionesChart() {
  const [data, setData] = useState<any[]>([])
  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      const meses = []
      const hoy = new Date()

      for (let i = 5; i >= 0; i--) {
        const fecha = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1)
        const mesInicio = fecha.toISOString().split("T")[0]
        const mesFin = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0).toISOString().split("T")[0]

        const { count } = await supabase
          .from("empleado_capacitacion")
          .select("*", { count: "exact", head: true })
          .gte("fecha_realizacion", mesInicio)
          .lte("fecha_realizacion", mesFin)

        meses.push({
          mes: fecha.toLocaleDateString("es-ES", { month: "short" }),
          capacitaciones: count || 0,
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
