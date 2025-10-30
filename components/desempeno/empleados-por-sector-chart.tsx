"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

interface EmpleadosPorSectorChartProps {
  data: { sector: string; empleados: number }[]
}

export function EmpleadosPorSectorChart({ data }: EmpleadosPorSectorChartProps) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart 
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="sector" 
          angle={-45} 
          textAnchor="end" 
          height={120}
          interval={0}
          tick={{ fontSize: 12 }}
        />
        <YAxis />
        <Tooltip />
        <Bar dataKey="empleados" fill="#2563eb" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
