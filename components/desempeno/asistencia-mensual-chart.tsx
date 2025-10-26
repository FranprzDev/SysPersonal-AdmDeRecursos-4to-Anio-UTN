"use client"

import { useEffect, useState } from "react"
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { createClient } from "@/lib/supabase/client"

export function AsistenciaMensualChart() {
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
          .from("asistencias")
          .select("*", { count: "exact", head: true })
          .gte("fecha", mesInicio)
          .lte("fecha", mesFin)

        meses.push({
          mes: fecha.toLocaleDateString("es-ES", { month: "short" }),
          asistencias: count || 0,
        })
      }

      setData(meses)
    }

    fetchData()
  }, [])

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="mes" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="asistencias" stroke="#10b981" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  )
}
